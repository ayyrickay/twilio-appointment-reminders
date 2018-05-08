import React, {Component} from 'react'
import { connect } from 'react-redux'
import { syncContacts, selectContact, deleteContact } from '../../actions/ContactList'
import PropTypes from 'prop-types'
import {Contact} from './Contact'
import styles from './ContactList.css'

export class ContactList extends Component {
  componentDidMount () {
    this.props.syncContacts()
  }

  toggleSelected (contact) {
    if (contact.selected === false) {
      this.props.addContact(contact)
    } else {
      this.props.deleteContact(contact)
    }
  }

  render () {
    return (
      <div className={styles.contactList}>
        <h2> Contacts </h2>
        {this.props.contactList.loading ?
          <p>Loading contacts...</p> :
          <ul>
            {this.props.contactList.contacts.map((props, i) => {
              return <Contact
                key={i}
                toggleSelected={this.toggleSelected.bind(this)}
                {...props}
              />
            })}
          </ul>
        }
      </div>
    )
  }
}

ContactList.propTypes = {
  syncContacts: PropTypes.func.isRequired,
  addContact: PropTypes.func,
  deleteContact: PropTypes.func,
  contactList: PropTypes.obj
}

const mapStateToProps = ({contactList}) => ({contactList})

const mapDispatchToProps = (dispatch) => ({
  syncContacts: () => {
    dispatch(syncContacts())
  },
  addContact: (contact) => {
    dispatch(selectContact(contact))
  },
  deleteContact: (contact) => {
    dispatch(deleteContact(contact))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)
