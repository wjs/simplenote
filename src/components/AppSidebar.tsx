import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import { Description, BookmarkBorder, Delete, Add, FolderOpen } from '@material-ui/icons'
import { Folders, FolderDict, Tag } from '../types'
import { NoteContainer, TagContainer, TagActionType, NoteActionType } from '../stores'

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
    borderRadius: '50%',
    fontSize: '1.2rem',
    color: '#888',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#555',
      color: 'inherit',
    },
  },
  tagInput: {
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
  },
  tagInputInner: {
    padding: '.5rem .8rem',
    backgroundColor: '#555',
    color: '#fff',
  },
})

const TagList: React.FC = () => {
  const classes = useStyles()
  const [editValue, setEditValue] = useState('')
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeTag } = noteState
  const { tagState, tagDispatch } = TagContainer.useContainer()
  const { tags, showAddTagInput } = tagState

  const handleAddTagSubmit = () => {
    const val = editValue.trim()
    if (val) {
      if (tags.indexOf(val) === -1) {
        tagDispatch({ type: TagActionType.ADD_TAG, payload: val })
      } else {
        // TODO: toastr error message
        console.log('duplicate tag')
      }
    }
    tagDispatch({ type: TagActionType.HIDE_ADD_TAG_INPUT })
    setEditValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTagSubmit()
    }
  }

  const handleChooseTag = (tag: Tag) => () => {
    noteDispatch({ type: NoteActionType.CHOOSE_TAG, payload: tag })
  }

  return (
    <>
      <div className={classes.tagTitle}>
        <h3>Tags</h3>
        <Add
          className={classes.addTagIcon}
          onClick={() => tagDispatch({ type: TagActionType.SHOW_ADD_TAG_INPUT })}
        />
      </div>
      <div>
        {tags.map(item => (
          <div
            key={item}
            className={`${classes.folderItem} ${activeTag === item ? 'active' : ''}`}
            onClick={handleChooseTag(item)}
          >
            <FolderOpen className={classes.folderIcon} />
            {item}
          </div>
        ))}
        {showAddTagInput ? (
          <TextField
            autoFocus
            className={classes.tagInput}
            inputProps={{
              className: classes.tagInputInner,
            }}
            placeholder="New tag..."
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={() => handleAddTagSubmit()}
            onKeyPress={handleKeyPress}
          />
        ) : null}
      </div>
    </>
  )
}

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
      <section className={classes.sidebarBottom}></section>
    </aside>
  )
}

export default AppSidebar
