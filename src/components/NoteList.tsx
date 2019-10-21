import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { NoteContainer, NoteActionType, SettingContainer } from '../stores'
import { FolderDict, Folders } from '../types'

const useStyles = makeStyles(theme => ({
  root: {
    gridArea: 'note-list',
    background: '#e8e8e8',
    borderRight: '1px solid #ccc',
  },
  dark: {
    backgroundColor: '#292929',
    '& $noteListHeader': {
      color: '#b7b7b7',
    },
    '& $noteItem': {
      borderBottom: '1px solid #1f1f1f',
      color: '#b7b7b7',
      '&:hover': {
        backgroundColor: '#3b3b3b',
      },
      '&.active': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
      },
    },
  },
  noteListHeader: {
    padding: '0.5rem',
    background: 'rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #bbb',
    textAlign: 'center',
    fontWeight: 700,
  },
  noteList: {},
  noteItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '3rem',
    padding: '.25rem .5rem',
    position: 'relative',
    cursor: 'pointer',
    borderBottom: '1px solid #d4d4d4',
    fontSize: '.9rem',
    '&:hover': {
      backgroundColor: '#dbdbdb',
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  },
}))

interface NoteListProps {}

const NoteList: React.FC<NoteListProps> = () => {
  const classes = useStyles()
  const { settingState } = SettingContainer.useContainer()
  const { darkMode } = settingState
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeFolder, activeTag, activeNoteId, notes } = noteState
  let displayNotes = notes.filter(x => !x.trash)
  if (activeFolder === Folders.FAVORITES) {
    displayNotes = displayNotes.filter(x => x.favorite)
  } else if (activeFolder === Folders.TRASH) {
    displayNotes = notes.filter(x => x.trash)
  } else if (activeFolder === Folders.TAG && activeTag) {
    displayNotes = displayNotes.filter(x => x.tags.indexOf(activeTag.id) > -1)
  }

  return (
    <aside className={`${classes.root} ${darkMode ? classes.dark : ''}`}>
      <div className={classes.noteListHeader}>
        {activeFolder === Folders.TAG ? activeTag && activeTag.name : FolderDict[activeFolder]}
      </div>
      <div className={classes.noteList}>
        {displayNotes.map(item => (
          <div
            key={item.id}
            className={`${classes.noteItem} ${activeNoteId === item.id ? 'active' : ''}`}
            onClick={() => noteDispatch({ type: NoteActionType.CHOOSE_NOTE, payload: item.id })}
          >
            {item.title}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default NoteList
