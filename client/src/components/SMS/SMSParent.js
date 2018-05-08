import React, {Component} from 'react'
import { connect } from 'react-redux'
import {sendMessage, updateMessageBody, updateMediaUrl} from '../../actions/SMS'
import isUrl from 'is-url'
import PropTypes from 'prop-types'
import SMSBuilder from './SMSBuilder/SMSBuilder.js'
import SMSPreview from './SMSPreview/SMSPreview.js'
import styles from './SMS.css'

export class SMSParent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasMessage: true,
      validMedia: true,
      hasRecipient: true,
      selectedContacts: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const selectedContacts = nextProps.contactList.contacts.filter(contact => contact.selected === true)

    if (selectedContacts === prevState.selectedContacts) {
      return null
    } else {
      return {
        selectedContacts
      }
    }
  }

  sendMessage () {
    if (this.state.selectedContacts.length === 0) {
      this.setState({hasRecipient: false})
      return
    }

    if(this.props.sms.messageBody.length < 1) {
      this.setState({hasMessage: false})
      return
    }

    if(this.props.sms.mediaUrl.length > 0 && !isUrl(this.props.sms.mediaUrl)) {
      this.setState({validMedia: false})
      return
    }

    if (this.state.hasRecipient && this.state.validMedia && this.state.hasMessage) {
      this.props.sendMessage(this.state.selectedContacts, this.props.sms.messageBody, this.props.sms.mediaUrl)
    }
  }

  render () {
    return (
      <div className={styles.SMSParent}>
        <SMSBuilder
          hasRecipient={this.state.hasRecipient}
          validMedia={this.state.validMedia}
          hasMessage={this.state.hasMessage}
          selectedContacts={this.state.selectedContacts}
          sms={this.props.sms}
          updateMessageBody={this.props.updateMessageBody}
          updateMediaUrl={this.props.updateMediaUrl}
        />
        <SMSPreview
          sendMessage={this.sendMessage.bind(this)}
          sms={this.props.sms}
          contacts={this.props.contactList.contacts}
        />
      </div>
    )
  }
}

SMSParent.propTypes = {
  contactList: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  sms: PropTypes.object.isRequired,
  updateMessageBody: PropTypes.func.isRequired,
  updateMediaUrl: PropTypes.func.isRequired
}

const mapStateToProps = ({sms, contactList}) => ({sms, contactList})

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (to, message, mediaUrl) => {
    dispatch(sendMessage(to, message, mediaUrl))
  },
  updateMessageBody: (value) => {
    dispatch(updateMessageBody(value))
  },
  updateMediaUrl: (value) => {
    dispatch(updateMediaUrl(value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SMSParent)
