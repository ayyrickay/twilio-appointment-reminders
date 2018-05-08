import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

// Bring in Redux
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducer'
import thunk from 'redux-thunk'

const store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

require('./index.html')

const container = document.getElementById('app-container')

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  container
)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContainer>,
      container
    )
  })
}
