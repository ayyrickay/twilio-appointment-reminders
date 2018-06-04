import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styles from './ContactList.css'

export class Contact extends Component {
  toggleSelected () {
    this.props.toggleSelected(this.props)
  }

  render () {
    return (
      <li className={styles.contact}>
        <div className={styles.contactImage}>
          <img src={this.props.photoUrl} className={styles.innerContactImage} alt="avatar img"/>
        </div>
        <div className={styles.contactInfo}>
          <h3 className={styles.contactName}>{`${this.props.firstName} ${this.props.lastName}`}</h3>
          <p className={styles.contactStatus}>{this.props.phoneNumber}</p>
          <p className={styles.contactStatus}>{this.props.status}</p>
        </div>
        <input
          type="checkbox"
          checked={this.props.selected}
          onChange={this.toggleSelected.bind(this)}
        />
      </li>
    )
  }
}

Contact.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phoneNumber: PropTypes.string,
  photoUrl: PropTypes.string,
  status: PropTypes.string,
  selected: PropTypes.bool,
  toggleSelected: PropTypes.func
}

export default Contact
