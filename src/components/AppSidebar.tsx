import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add, Delete, Description, Favorite, Settings } from '@material-ui/icons'
import React from 'react'
import { NoteActionType, NoteContainer, SettingActionType, SettingContainer } from '../stores'
import { FolderDict, Folders } from '../types'
import SettingDialog from './SettingDialog'
import TagList from './TagList'

const useStyles = makeStyles(theme => ({
  appSidebar: {
    gridArea: 'app-sidebar',
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
      '& $folderIcon': {
        color: theme.palette.primary.main,
      },
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
    margin: '.5rem 0 0',
  },
  bottomIcon: {
    margin: '0 .5rem',
    padding: '.5rem',
    backgroundColor: '#292929',
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

const menus = [
  {
    key: Folders.ALL,
    text: FolderDict[Folders.ALL],
    icon: Description,
  },
  {
    key: Folders.FAVORITES,
    text: FolderDict[Folders.FAVORITES],
    icon: Favorite,
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
  const { settingDispatch } = SettingContainer.useContainer()
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeFolder } = noteState

  const handleAddNode = () => {
    noteDispatch({ type: NoteActionType.ADD_NOTE })
    settingDispatch({ type: SettingActionType.TOGGLE_PREVIEW_MODE, payload: false })
    noteDispatch({ type: NoteActionType.CHOOSE_FOLDER, payload: Folders.ALL })
  }

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
        <IconButton color="primary" className={classes.bottomIcon} onClick={handleAddNode}>
          <Add />
        </IconButton>
        <IconButton
          color="primary"
          className={classes.bottomIcon}
          onClick={() => settingDispatch({ type: SettingActionType.TOGGLE_SETTING_DIALOG })}
        >
          <Settings />
        </IconButton>
        <SettingDialog />
      </section>
    </aside>
  )
}

export default AppSidebar
