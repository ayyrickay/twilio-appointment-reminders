import {combineReducers} from 'redux'
import contactList from './ContactList'
import sms from './SMS'

export default combineReducers({
  contactList,
  sms
})
