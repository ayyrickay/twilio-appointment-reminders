import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMSPreview.css'

const SMSPreview = (props) => {
  return (
    <div className={styles.messagePreview}>
      <h2>Preview</h2>
      <div className={styles.imgPreview}>
        <img className={styles.innerImage} src={props.sms.mediaUrl} />
      </div>
      <p className={styles.textPreview}>{props.sms.messageBody}</p>
      <button onClick={props.sendMessage} className={styles.button}>Send Message</button>
    </div>
  )
}

SMSPreview.propTypes = {
  contacts: PropTypes.array.isRequired,
  sendMessage: PropTypes.func.isRequired,
  sms: PropTypes.object.isRequired,
}

export default SMSPreview
