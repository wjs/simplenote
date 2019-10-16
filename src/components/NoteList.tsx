import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { NoteContainer } from '../stores'
import { FolderDict, Folders } from '../types'

const useStyles = makeStyles({
  root: {
    background: '#e8e8e8',
    borderRight: '1px solid #ccc',
  },
  noteListHeader: {
    padding: '0.5rem',
    background: 'rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #bbb',
    textAlign: 'center',
    fontWeight: 700,
  },
  noteList: {},
  noteItem: {},
})

interface NoteListProps {}

const NoteList: React.FC<NoteListProps> = () => {
  const classes = useStyles()
  const { noteState } = NoteContainer.useContainer()
  const { activeFolder, activeTag, notes } = noteState

  return (
    <aside className={classes.root}>
      <div className={classes.noteListHeader}>
        {activeFolder === Folders.TAG ? activeTag : FolderDict[activeFolder]}
      </div>
      <div className={classes.noteList}>
        {notes.map(item => (
          <div key={item.id} className={classes.noteItem}>
            {item.content}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default NoteList
