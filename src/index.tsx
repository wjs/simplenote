import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import { SettingContainer } from './stores'

ReactDOM.render(
  <SettingContainer.Provider>
    <App />
  </SettingContainer.Provider>,
  document.getElementById('root')
)
