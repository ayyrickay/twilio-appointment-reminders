import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMSBuilder.css'

const SMSBuilder = (props) => {

  const updateText = (event) => {
    props.updateMessageBody(event.target.value)
  }

  const updateMedia = (event) => {
    props.updateMediaUrl(event.target.value)
  }

  return (
    <div className={styles.messageForm}>
      <h2>Message Details</h2>
      <div className={styles.numberList}>
        <p>To</p>
        <ul className={styles.selectedNumbers}>
          {props.selectedContacts.length > 0 ?
            props.selectedContacts.map(contact => (<li key={contact.phoneNumber}> {contact.phoneNumber} </li>)) :
            <p> Select a contact from the list on the right. </p>
          }
        </ul>
      </div>
      <div className={styles.formDiv}>
        <p>Message Body</p>
        <p className={props.hasMessage ? styles.hideText : styles.errorText}>Please include a valid message body.</p>
        <textarea
          className={styles.messageBody}
          value={props.sms.messageBody}
          onChange={updateText}
        />
      </div>
      <div className={styles.formDiv}>
        <p>Media URL</p>
        <p className={props.validMedia ? styles.hideText : styles.errorText}>Invalid Media URL</p>
        <input
          className={styles.mediaURL}
          type="url"
          value={props.sms.mediaUrl.length > 0 ? props.sms.mediaUrl : 'http://host.com/yourMediaUrlHere.jpg'}
          onChange={updateMedia}/>
      </div>
    </div>
  )
}

SMSBuilder.propTypes = {
  hasMessage: PropTypes.bool.isRequired,
  validMedia: PropTypes.bool.isRequired,
  updateMessageBody: PropTypes.func.isRequired,
  updateMediaUrl: PropTypes.func.isRequired,
  sms: PropTypes.object,
  selectedContacts: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SMSBuilder
