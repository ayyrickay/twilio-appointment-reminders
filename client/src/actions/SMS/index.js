import config from 'config'
import {SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE, UPDATE_MESSAGE_BODY, UPDATE_MEDIA_URL} from '../../constants/ActionTypes'

export const updateMessageBody = (messageBody) => {
  return {
    type: UPDATE_MESSAGE_BODY,
    messageBody
  }
}

export const updateMediaUrl = (mediaUrl) => {
  return {
    type: UPDATE_MEDIA_URL,
    mediaUrl
  }
}

export const sendMessageRequest = () => {
  return {
    type: SEND_MESSAGE_REQUEST
  }
}

export const sendMessageSuccess = (message) => {
  return {
    type: SEND_MESSAGE_SUCCESS,
    message
  }
}

export const sendMessageFailure = (message) => {
  return {
    type: SEND_MESSAGE_FAILURE,
    message
  }
}

export const sendMessage = (contactList, messageBody, mediaUrl) => {
  let responseState = null
  return dispatch => {
    dispatch(sendMessageRequest())
    fetch(`${config.apiEndpoint}/offer`, {
      method: 'POST',
      body: JSON.stringify({'to': contactList, 'message': messageBody, 'mediaUrl': mediaUrl})
    })
      .then((response) => {
        responseState = response.ok
        return response.json()
      })
      .then((json) => {
        if (responseState) {
          dispatch(sendMessageSuccess(json))
        } else {
          dispatch(sendMessageFailure(json))
        }
      })
      .catch((err) => {
        dispatch(sendMessageFailure(err))
      })
  }
}
