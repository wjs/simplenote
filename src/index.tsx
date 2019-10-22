import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import { SettingContainer, NoteContainer, TagContainer } from './stores'

ReactDOM.render(
  <SettingContainer.Provider>
    <NoteContainer.Provider>
      <TagContainer.Provider>
        <App />
      </TagContainer.Provider>
    </NoteContainer.Provider>
  </SettingContainer.Provider>,
  document.getElementById('root')
)
