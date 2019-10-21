import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import React, { useEffect } from 'react'
import { NoteContainer, SettingActionType, SettingContainer, TagContainer } from '../stores'
import AppSidebar from './AppSidebar'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateAreas: `'app-sidebar note-list editor'`,
    gridTemplateColumns: '200px 300px auto',
    height: '100vh',
  },
})

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#38b397',
    },
  },
})

const App: React.FC = () => {
  const classes = useStyles()
  const { settingDispatch } = SettingContainer.useContainer()

  useEffect(() => {
    Mousetrap.bindGlobal('esc', function() {
      settingDispatch({ type: SettingActionType.TOGGLE_PREVIEW_MODE, payload: true })
      return false
    })
    Mousetrap.bindGlobal(['ctrl+e', 'command+e'], function() {
      settingDispatch({ type: SettingActionType.TOGGLE_PREVIEW_MODE, payload: false })
      return false
    })
    Mousetrap.bindGlobal(['ctrl+d', 'command+d'], function() {
      settingDispatch({ type: SettingActionType.TOGGLE_DARK_MODE })
      return false
    })
  })

  return (
    <div className={classes.root}>
      <NoteContainer.Provider>
        <TagContainer.Provider>
          <MuiThemeProvider theme={theme}>
            <AppSidebar />
            <NoteList />
            <NoteEditor />
          </MuiThemeProvider>
        </TagContainer.Provider>
      </NoteContainer.Provider>
    </div>
  )
}

export default App
