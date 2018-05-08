# sms appointment reminders
A react app with a flask backend for sending appointment creation notices and appointment reminders.

## Client

### Setup
This app was built using Node v9.11.0

Once you've cloned this repository and switched to the client directory, install the app dependencies using `npm install`. You'll also want to go into `src/config` and duplicate `template.js`. Rename the duplicated file `index.js` and include your Twilio credentials (don't worry, this is `gitignored`.) Once dependencies are installed and your configuration is set up, you can use the command `npm start` to run the app. It should appear on `localhost:8080`.

### Client/React app commands

`npm test` runs the suite of unit tests against the app. This is particularly useful if you intend to extend the app without changing its core behaviors (note: this app is not currently unit tested, but tests are on the way.)

`npm run lint` will run a linter on the application and make fun of your syntax. Linting rules are based on my personal preferences - namely, my preference for avoiding semicolons and double quotes in my code.

## Server
This app was built with Python 2.7. We recommend that you use a virtual environment for development purposes.

Once you've cloned this repository and switched to the server directory, you can install the necessary dependencies using:

`pip install -r requirements.txt`

You will also want to duplicate `example.env` and rename it `.env`. Include your Twilio credentials, which include an API Key and API Secret (generated via the Twilio Console.) Also, create a messaging service with at least one phone number in it to begin sending messages.

Finally, this application utilizes a sync service to manage customer state between the client and server. Include a Sync Service SID to make customers addressable.

Once your dependencies are installed and your environment is set up, you can use `python app.py` to run the app. It should begin running on port `localhost:3000`.

### Useful Endpoints

`/reset`: reset the status of all of your customers to "new customer"

TODO: `/upload`: sets your sync map to a map provided in `app.py`. See the schema for customer information for more detail

### Schema for customer info
You'll also want to add customers to your Sync Service. Customers are represented in the following format:

```
customers.set('001', {
  'firstName': 'Ari',
  'lastName': 'Sigal',
  'phoneNumber': '+14155559876',
  'status': 'new customer'
})

customers.set('002', {
  'firstName': 'Michael',
  'lastName': 'Banks',
  'phoneNumber': '+15105551234',
  'status': 'new customer'
})

customers.set('003', {
  'firstName': 'Janet',
  'lastName': 'Banks',
  'phoneNumber': '+19835557772',
  'status': 'new customer'
})

customers.set('004', {
  'firstName': 'Ricky',
  'lastName': 'Holtz',
  'phoneNumber': '+1212555665',
  'status': 'new customer'
})
```
