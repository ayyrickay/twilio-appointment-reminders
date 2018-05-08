"""Understands how to serve sync tokens and send SMS reminders"""
#!/usr/local/bin/env python
import os
from os.path import join, dirname
import logging
import json
import phonenumbers
from flask import Flask, abort, jsonify, render_template, request, Response, url_for
from faker import Factory
from twilio.rest import Client
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import (
    SyncGrant
)
from dotenv import load_dotenv, find_dotenv

logging.info("starting app")

APP = Flask(__name__)
FAKE = Factory.create()
DOTENV_PATH = join(dirname(__file__), '.env')
load_dotenv(DOTENV_PATH)

debug = os.getenv("debugger", True) # pylint: disable=C0103
APP.debug = debug
logging.info("started app")

###################################################################
# Constants
###################################################################
# Populate the URL whitelist with urls that you're using for development
URL_WHITELIST = ['http://localhost:8080', 'https://localhost:8080']
# Populate the recipient whitelist with phone numbers that you're using to test your app
RECIPIENT_WHITELIST = ['+14155551234']

###################################################################
# Utility Functions
###################################################################
def format_to_e164(unformatted_number):
    parsed = phonenumbers.parse(unformatted_number)
    return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)

def update_status(number_to_update, status):
    if number_to_update == '':
        return

    client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])
    map_items = client.sync \
        .services(os.environ['TWILIO_SYNC_SERVICE_SID']) \
        .sync_maps('contact_names') \
        .sync_map_items \
        .list()

    for item in map_items:
        data = item.data
        customer_number = data['phoneNumber']
        if customer_number == number_to_update:
            data['status'] = status
            item.update(data=data)
        else:
            print item.data

def send_message(number, message, media_url, status):
    client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])
    update_status(number, status)
    if number not in RECIPIENT_WHITELIST:
        return 'Recipient not in whitelist'

    if  media_url != '':
        message = client.messages.create(
            to=number,
            messaging_service_sid=os.environ['MESSAGING_SERVICE_SID'],
            body=message,
            media_url=media_url
        )
    else:
        message = client.messages.create(
            to=number,
            messaging_service_sid=os.environ['MESSAGING_SERVICE_SID'],
            body=message
        )

    return message

###################################################################
# Middleware
###################################################################
@APP.after_request
def add_cors_headers(response):
    referrer = request.referrer[:-1] if request.referrer else ''
    if referrer in URL_WHITELIST:
        response.headers.add('Access-Control-Allow-Origin', referrer)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Headers', 'Cache-Control')
        response.headers.add('Access-Control-Allow-Headers', 'X-Requested-With')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    return response

###################################################################
# Endpoints
###################################################################
@APP.route('/config')
def config():
    return jsonify(
        TWILIO_ACCOUNT_SID=os.environ['TWILIO_ACCOUNT_SID'],
        TWILIO_AUTH_TOKEN=bool(os.environ['TWILIO_AUTH_TOKEN']),
        TWILIO_API_KEY=os.environ['TWILIO_API_KEY'],
        TWILIO_API_SECRET=bool(os.environ['TWILIO_API_SECRET']),
        TWILIO_SYNC_SERVICE_SID=os.environ.get('TWILIO_SYNC_SERVICE_SID', 'default'),
        MESSAGING_SERVICE_SID=os.environ['MESSAGING_SERVICE_SID']
    )


# route to serve the scheduler
@APP.route('/scheduler')
def scheduler():
    return render_template('scheduler.html')

@APP.route('/token', methods=['GET'])
def random_token():
    return generate_token(FAKE.user_name())

@APP.route('/token', methods=['POST'])
def create_token():
    content = request.get_json() or request.form
    identity = content.get('identity', FAKE.user_name())
    return generate_token(identity)

@APP.route('/token/<identity>', methods=['POST', 'GET'])
def token(identity):
    return generate_token(identity)

def generate_token(identity):
    account_sid = os.environ['TWILIO_ACCOUNT_SID']
    api_key = os.environ['TWILIO_API_KEY']
    api_secret = os.environ['TWILIO_API_SECRET']
    sync_service_sid = os.environ.get('TWILIO_SYNC_SERVICE_SID', 'default')

    new_token = AccessToken(account_sid, api_key, api_secret, identity=identity)

    sync_grant = SyncGrant(service_sid=sync_service_sid)
    new_token.add_grant(sync_grant)

    return jsonify(identity=identity, token=new_token.to_jwt().decode('utf-8'))

# send an appointment confirmation request to a customer using STUDIO
@APP.route('/confirmation', methods=['GET'])
def confirmation():
    client = Client(os.environ['TWILIO_API_KEY'], os.environ['TWILIO_API_SECRET'], os.environ['TWILIO_ACCOUNT_SID'])
    contact_number = format_to_e164(request.args.get('to'))
    appointment_time = request.args.get('time')
    update_status(contact_number, 'booked appointment')
    print 'updating to booked ' + contact_number

    parameters = {'appointment_date': appointment_time}
    json_params = json.dumps(parameters)
    client.studio.flows(os.environ['STUDIO_CONFIRMATION_FLOW'])\
        .engagements\
        .create(contact_number, os.environ['MESSAGING_SERVICE_SID'], json_params)

    return render_template('confirmation.html')

# route to request sending of marketing message to customer
@APP.route('/offer', methods=['POST'])
def send_offer():
    data = json.loads(request.data)
    contact_list = data.get('to', [])
    message = data.get('message', '')
    media_url = data.get('mediaUrl', '')
    promo_sent_status = 'promo sent'

    if not contact_list or not message:
        abort(400, 'Please include valid message body and recipient(s).')

    for contact in contact_list:
        number = format_to_e164(contact.get('phoneNumber', ''))

        promo_message = message\
            .replace("$BOOKING_URL", url_for('scheduler', to=number, _external=True))
        send_message(number, promo_message, media_url, promo_sent_status)

    return message

@APP.route('/contact_status', methods=["POST"])
def update_contact_status():
    recipient = request.values.get('to', '')
    status = request.values.get('status', 'unkown status')
    print recipient
    print status
    update_status(recipient, status)
    return 'status updated'

"""
Not a RESTful method; designed simply to reset the demo statuses
"""
@APP.route('/reset', methods=["GET"])
def reset_status():
    client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])
    map_items = client.sync \
        .services(os.environ['TWILIO_SYNC_SERVICE_SID']) \
        .sync_maps('contact_names') \
        .sync_map_items \
        .list()

    for i, item in enumerate(map_items):
        data = item.data
        data['status'] = "new customer"
        item.update(data=data)
        print data

    return 'Reset items in sync map'

if __name__ == '__main__':
    logging.info("running app")
    PORT = int(os.environ.get('PORT', 3000))
    APP.run(host='0.0.0.0', port=PORT)
