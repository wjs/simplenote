import { makeStyles } from '@material-ui/core/styles'
import { BookmarkBorder, Delete, Description, Add, Settings } from '@material-ui/icons'
import React from 'react'
import { NoteActionType, NoteContainer } from '../stores'
import { FolderDict, Folders } from '../types'
import TagList from './TagList'

const useStyles = makeStyles({
  appSidebar: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0 0.25rem',
    backgroundColor: '#333',
    color: 'rgba(255,255,255,.8)',
  },
  sidebarMain: {
    flexGrow: 1,
  },
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '.5rem',
    cursor: 'pointer',
    fontSize: '.9rem',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#555',
    },
    '&.active': {
      backgroundColor: '#101010',
    },
  },
  folderIcon: {
    marginRight: '.5rem',
    fontSize: '1.1rem',
  },
  sidebarBottom: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '.5rem 0',
  },
  bottomIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 0.5rem',
    padding: '0.7rem',
    borderRadius: '50%',
    backgroundColor: '#292929',
    fontSize: '3rem',
    cursor: 'pointer',
    '&:hover': {
      color: 'green',
    },
  },
})

const menus = [
  {
    key: Folders.ALL,
    text: FolderDict[Folders.ALL],
    icon: Description,
  },
  {
    key: Folders.FAVORITES,
    text: FolderDict[Folders.FAVORITES],
    icon: BookmarkBorder,
  },
  {
    key: Folders.TRASH,
    text: FolderDict[Folders.TRASH],
    icon: Delete,
  },
]

interface AppSidebarProps {}

const AppSidebar: React.FC<AppSidebarProps> = () => {
  const classes = useStyles()
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeFolder } = noteState

  return (
    <aside className={classes.appSidebar}>
      <section className={classes.sidebarMain}>
        {menus.map(item => (
          <div
            key={item.key}
            className={`${classes.folderItem} ${activeFolder === item.key ? 'active' : ''}`}
            onClick={() => noteDispatch({ type: NoteActionType.CHOOSE_FOLDER, payload: item.key })}
          >
            {React.createElement(item.icon, { className: classes.folderIcon })} {item.text}
          </div>
        ))}
        <TagList />
      </section>
      <section className={classes.sidebarBottom}>
        <Add className={classes.bottomIcon} />
        <Settings className={classes.bottomIcon} />
      </section>
    </aside>
  )
}

export default AppSidebar
