import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Description, BookmarkBorder, Delete, Add, FolderOpen } from '@material-ui/icons'
import { Folders, FolderDict } from '../types'
import { NoteContainer } from '../stores'
import { TagContainer } from '../stores/tags'

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
  sidebarBottom: {},
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
  tagTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem',
    padding: '.5rem',
    '& h3': {
      margin: 0,
      color: '#888',
      fontSize: '0.9rem',
    },
  },
  addTagIcon: {
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  tags: {},
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
  const { activeFolder, changeActiveFolder, changeActiveTag } = NoteContainer.useContainer()
  const { tags } = TagContainer.useContainer()

  return (
    <aside className={classes.appSidebar}>
      <section className={classes.sidebarMain}>
        {menus.map(item => (
          <div
            key={item.key}
            className={`${classes.folderItem} ${activeFolder === item.key ? 'active' : ''}`}
            onClick={() => changeActiveFolder(item.key)}
          >
            {React.createElement(item.icon, { className: classes.folderIcon })} {item.text}
          </div>
        ))}
        <div className={classes.tagTitle}>
          <h3>Tags</h3>
          <Add className={classes.addTagIcon} />
        </div>
        <div>
          {tags.map(item => (
            <div
              key={item}
              className={`${classes.folderItem} ${activeFolder === item ? 'active' : ''}`}
              onClick={() => changeActiveTag(item)}
            >
              <FolderOpen className={classes.folderIcon} />
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className={classes.sidebarBottom}></section>
    </aside>
  )
}

export default AppSidebar
