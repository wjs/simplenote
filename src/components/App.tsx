import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import React, { useEffect } from 'react'
import {
  NoteContainer,
  SettingActionType,
  SettingContainer,
  TagContainer,
  NoteActionType,
  TagActionType,
} from '../stores'
import AppSidebar from './AppSidebar'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'
import { useInterval } from '../utils'
import { saveData, getNotes, getTags } from '../api'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateAreas: `'app-sidebar note-list editor'`,
    gridTemplateColumns: '150px 300px auto',
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
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { tagState, tagDispatch } = TagContainer.useContainer()

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
    Mousetrap.bindGlobal(['ctrl+alt+n', 'command+alt+n'], function() {
      noteDispatch({ type: NoteActionType.ADD_NOTE })
      return false
    })
  })

  useEffect(() => {
    getNotes().then(res => {
      noteDispatch({ type: NoteActionType.LOAD_NOTES, payload: res })
    })
  }, [noteDispatch])

  useEffect(() => {
    getTags().then(res => {
      tagDispatch({ type: TagActionType.LOAD_TAGS, payload: res })
    })
  }, [tagDispatch])

  useInterval(() => {
    saveData(noteState.notes, tagState.tags)
  }, 20000)

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <AppSidebar />
        <NoteList />
        <NoteEditor />
      </MuiThemeProvider>
    </div>
  )
}

export default App
