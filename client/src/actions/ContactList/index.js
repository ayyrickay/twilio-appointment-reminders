import config from 'config'
import SyncClient from 'twilio-sync'
import {DELETE_CONTACT, LOAD_CONTACTS_REQUEST, LOAD_CONTACTS_SUCCESS, LOAD_CONTACTS_FAILURE, SELECT_CONTACT, UPDATE_CONTACT_STATUS, WEB_SOCKET_CREATED_SUCCESS} from '../../constants/ActionTypes'

export const selectContact = (contact) => {
  return {
    type: SELECT_CONTACT,
    contact
  }
}

export const deleteContact = (contact) => {
  return {
    type: DELETE_CONTACT,
    contact
  }
}

export const loadContactsRequest = () => {
  return {
    type: LOAD_CONTACTS_REQUEST,
    loading: true
  }
}

export const loadContactsSuccess = (contacts) => {
  return {
    type: LOAD_CONTACTS_SUCCESS,
    loading: false,
    contacts
  }
}

export const loadContactsFailure = (contacts) => {
  return {
    type: LOAD_CONTACTS_FAILURE,
    loading: false,
    contacts
  }
}

export const updateContactStatus = (contact) => {
  return {
    type: UPDATE_CONTACT_STATUS,
    loading: false,
    contact
  }
}

export const webSocketCreatedSuccess = () => {
  return {
    type: WEB_SOCKET_CREATED_SUCCESS
  }
}

export const syncContacts = () => {
  return dispatch => {
    return fetch(`${config.apiEndpoint}/token`)
      .then(response => response.json())
      .then((data) => {
        dispatch(webSocketCreatedSuccess())
        const syncClient = new SyncClient(data.token, {logLevel: 'info'})
        dispatch(loadContactsRequest())
        syncClient.map('contact_names')
          .then((customers) => {
            customers.on('itemUpdated', (customer) => {
              dispatch(updateContactStatus(customer.value))
            })

            customers.getItems().then(page => {
              const customerArray = page.items.map(customer => {
                const status = customer.value.status
                if (status === null) {customer.value.status = 'new customer'}
                customer.value.selected = false
                return customer.value
              })

              dispatch(loadContactsSuccess(customerArray))
            })
          })
      }).catch((err) => {
        console.error(err) // eslint-disable-line
      })
  }
}
