import * as ContactActions from '../../constants/ActionTypes'

const initialState = {
  loading: false,
  contacts: []
}

export default function contactList(state = initialState, action) {
  switch (action.type) {
    case ContactActions.LOAD_CONTACTS_REQUEST:
      return Object.assign({}, action, state)
    case ContactActions.LOAD_CONTACTS_SUCCESS:
      return Object.assign({}, state, action)
    case ContactActions.LOAD_CONTACTS_FAILURE:
      return Object.assign({}, state, action)
    case ContactActions.SELECT_CONTACT: {
      const newArray = state.contacts.map(contact => {
        if (contact.phoneNumber === action.contact.phoneNumber) {
          contact.selected = true
        }
        return contact
      })
      return Object.assign({}, state, {contacts: newArray})
    }
    case ContactActions.DELETE_CONTACT: {
      const newArray = state.contacts.map((contact) => {
        if (contact.phoneNumber === action.contact.phoneNumber) {
          contact.selected = false
        }
        return contact
      })
      return Object.assign({}, state, {contacts: newArray})
    }
    case ContactActions.UPDATE_CONTACT_STATUS: {
      const updatedContacts = state.contacts.map((currentContact) => {
        if (currentContact.phoneNumber === action.contact.phoneNumber) {
          return Object.assign({}, currentContact, action.contact)
        } else {
          return currentContact
        }
      })
      return Object.assign({}, state, {contacts: updatedContacts})
    }
    default:
      return state
  }
}
