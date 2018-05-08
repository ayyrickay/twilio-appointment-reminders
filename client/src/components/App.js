import React from 'react'
import ContactList from './ContactList/ContactList.js'
import SMSParent from './SMS/SMSParent.js'
import './GlobalStyles.css'
import styles from './App.css'

const App = () =>

  <div className={styles.appContainer}>
    <header className={styles.header}>
      <h1 className={styles.title}>Drs Twilly and Oh, DDS</h1>
    </header>
    <ContactList />
    <SMSParent />
  </div>

export default App
