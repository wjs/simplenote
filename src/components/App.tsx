import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
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
import { useInterval, useKey } from '../utils'
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

  useKey('esc', () => {
    settingDispatch({ type: SettingActionType.TOGGLE_PREVIEW_MODE, payload: true })
  })
  useKey('g e', () => {
    settingDispatch({ type: SettingActionType.TOGGLE_PREVIEW_MODE, payload: false })
  })
  useKey('g d', () => {
    settingDispatch({ type: SettingActionType.TOGGLE_DARK_MODE })
  })
  useKey('g n', () => {
    noteDispatch({ type: NoteActionType.ADD_NOTE })
    settingDispatch({ type: SettingActionType.TOGGLE_PREVIEW_MODE, payload: false })
  })
  useKey(['ctrl+s', 'command+s'], () => {
    saveData(noteState.notes, tagState.tags)
  })

  useEffect(() => {
    getNotes().then(res => {
      noteDispatch({ type: NoteActionType.LOAD_NOTES, payload: res })
      if (res && res.length) {
        noteDispatch({ type: NoteActionType.CHOOSE_NOTE, payload: res[0].id })
      }
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
