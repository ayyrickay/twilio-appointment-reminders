import * as SMSActions from '../../constants/ActionTypes'

const initialState = {
  messageBody: 'It\'s time for a cleaning with Dr. Twilly! Visit $BOOKING_URL to book your appt.',
  mediaUrl: '',
  sending: false
}

export default function fax(state = initialState, action) {
  switch (action.type) {
    case SMSActions.UPDATE_MESSAGE_BODY:
      return Object.assign({}, state, action)
    case SMSActions.UPDATE_MEDIA_URL:
      return Object.assign({}, state, action)
    case SMSActions.SEND_MESSAGE_REQUEST:
      return Object.assign({}, state, {sending: true})
    case SMSActions.SEND_MESSAGE_SUCCESS:
      return Object.assign({}, state, {sending: false})
    case SMSActions.SEND_MESSAGE_FAILURE:
      return Object.assign({}, state, {sending: false})
    default:
      return state
  }
}
