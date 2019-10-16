import { TextField, Dialog, DialogContent, DialogActions, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add, FolderOpen, Clear } from '@material-ui/icons'
import React, { useState } from 'react'
import { NoteActionType, NoteContainer, TagActionType, TagContainer } from '../stores'
import { Tag, Folders } from '../types'

const useStyles = makeStyles({
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '.5rem',
    cursor: 'pointer',
    fontSize: '.9rem',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#555',
      '& $delIcon': {
        display: 'block',
      },
    },
    '&.active': {
      backgroundColor: '#101010',
    },
  },
  folderIcon: {
    marginRight: '.5rem',
    fontSize: '1.1rem',
  },
  delIcon: {
    display: 'none',
    fontSize: '1.1rem',
    '&:hover': {
      color: '#fff',
    },
  },
  tagText: {
    flexGrow: 1,
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

interface TagListProps {}

const TagList: React.FC<TagListProps> = () => {
  const classes = useStyles()
  const [editValue, setEditValue] = useState('')
  const [open, setOpen] = useState(false)
  const [tagToBeDel, setTagToBeDel] = useState('')
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

  const handleDelTag = (tag: Tag) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setTagToBeDel(tag)
    setOpen(true)
  }

  const handleConfirmDelTag = () => {
    tagDispatch({ type: TagActionType.DEL_TAG, payload: tagToBeDel })
    setOpen(false)
    if (activeTag === tagToBeDel) {
      noteDispatch({ type: NoteActionType.CHOOSE_FOLDER, payload: Folders.ALL })
    }
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
            <span className={classes.tagText}>{item}</span>
            <Clear className={classes.delIcon} onClick={handleDelTag(item)} />
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

        <Dialog disableBackdropClick maxWidth="xs" open={open}>
          <DialogContent>
            Are you sure want to delete tag: <strong>{tagToBeDel}</strong> ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelTag} color="secondary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default TagList
