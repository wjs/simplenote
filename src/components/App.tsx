import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { getInit, saveData } from '../api'
import {
  NoteActionType,
  NoteContainer,
  SettingActionType,
  SettingContainer,
  TagActionType,
  TagContainer,
} from '../stores'
import { useInterval, useKey } from '../utils'
import AppSidebar from './AppSidebar'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'

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
    getInit().then(res => {
      const { notes, tags, activeNoteId } = res
      noteDispatch({ type: NoteActionType.LOAD_NOTES, payload: notes })
      tagDispatch({ type: TagActionType.LOAD_TAGS, payload: tags })
      if (activeNoteId) {
        noteDispatch({ type: NoteActionType.CHOOSE_NOTE, payload: activeNoteId })
      }
    })
  }, [noteDispatch, tagDispatch])

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
