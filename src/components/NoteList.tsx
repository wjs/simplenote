import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NoteContainer } from '../stores'
import { FolderDict } from '../types'

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
})

interface NoteListProps {}

const NoteList: React.FC<NoteListProps> = () => {
  const classes = useStyles()
  const { activeFolder, notes } = NoteContainer.useContainer()

  return (
    <aside className={classes.root}>
      <div className={classes.noteListHeader}>{FolderDict[activeFolder]}</div>
      <div className={classes.noteList}>
        {notes.map(item => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
    </aside>
  )
}

export default NoteList
