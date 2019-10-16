import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppSidebar from './AppSidebar'
import NoteList from './NoteList'
import NoteEditor from './NoteEditor'
import { NoteContainer, TagContainer } from '../stores'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateAreas: 'app-sidebar note-list editor',
    gridTemplateColumns: '200px 300px auto',
    height: '100vh',
  },
})

const App: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <NoteContainer.Provider>
        <TagContainer.Provider>
          <AppSidebar />
        </TagContainer.Provider>
        <NoteList />
        <NoteEditor />
      </NoteContainer.Provider>
    </div>
  )
}

export default App
