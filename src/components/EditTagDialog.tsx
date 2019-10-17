import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { DeleteForever, Edit, Label } from '@material-ui/icons'
import React, { useState } from 'react'
import { NoteActionType, NoteContainer, TagActionType, TagContainer } from '../stores'
import { Folders, Tag } from '../types'

const useStyles = makeStyles({
  dialogTitle: {
    paddingBottom: 0,
    marginBottom: '-1px',
    borderBottom: '1px solid #fff',
    zIndex: 10,
  },
  icon: {
    marginRight: '.5rem',
    fontSize: '1.25rem',
    opacity: 0.54,
    '&:hover': {
      opacity: 0.8,
    },
  },
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      '& $tagIcon': {
        display: 'none',
      },
      '& $delIcon': {
        display: 'block',
      },
      '& $editIcon': {
        display: 'block',
      },
    },
  },
  tagIcon: {},
  delIcon: {
    display: 'none',
  },
  editIcon: {
    display: 'none',
    fontSize: '1.1rem',
  },
  tagText: {
    flexGrow: 1,
    padding: '.5rem 0',
    fontWeight: 600,
  },
  tagInput: {
    marginBottom: '.2rem',
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
  },
  tagInputInner: {
    padding: '.5rem .8rem',
  },
})

interface EditTagDialogProps {
  open: boolean
  handleClose: () => void
}

const EditTagDialog: React.FC<EditTagDialogProps> = ({ open, handleClose }) => {
  const classes = useStyles()
  const [addValue, setAddValue] = useState('')
  const [editValue, setEditValue] = useState('')
  const [editTagId, setEditTagId] = useState('')
  const [tagToBeDel, setTagToBeDel] = useState<Tag | null>(null)
  const [openDel, setOpenDel] = useState(false)
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeTag } = noteState
  const { tagState, tagDispatch } = TagContainer.useContainer()
  const { tags } = tagState

  const submit = () => {
    const val = editTagId ? editValue.trim() : addValue.trim()
    if (val) {
      const t = tags.find(x => x.name === val)
      if (editTagId) {
        // edit tag
        if (!t) {
          tagDispatch({ type: TagActionType.EDIT_TAG, payload: { id: editTagId, name: val } })
        } else if (t && t.id !== editTagId) {
          // TODO: toastr error message
          console.log('duplicate tag')
        }
        setEditTagId('')
      } else {
        // add new tag
        if (!t) {
          tagDispatch({ type: TagActionType.ADD_TAG, payload: val })
        } else {
          // TODO: toastr error message
          console.log('duplicate tag')
        }
      }
    }
    editTagId ? setEditValue('') : setAddValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  const handleDelTag = (tag: Tag) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setTagToBeDel(tag)
    setOpenDel(true)
  }

  const handleConfirmDelTag = () => {
    if (tagToBeDel) {
      tagDispatch({ type: TagActionType.DEL_TAG, payload: tagToBeDel.id })
    }
    setOpenDel(false)
    if (activeTag === tagToBeDel) {
      noteDispatch({ type: NoteActionType.CHOOSE_FOLDER, payload: Folders.ALL })
    }
  }

  const handleEdit = (tag: Tag) => () => {
    setEditValue(tag.name)
    setEditTagId(tag.id)
  }

  return (
    <>
      <Dialog disableBackdropClick={addValue || editValue} onClose={handleClose} open={open}>
        <DialogTitle className={classes.dialogTitle}>
          <div>Edit Tags</div>
          <TextField
            autoFocus
            className={classes.tagInput}
            inputProps={{
              className: classes.tagInputInner,
            }}
            placeholder="New tag..."
            value={addValue}
            onChange={e => setAddValue(e.target.value)}
            onBlur={() => submit()}
            onKeyPress={handleKeyPress}
          />
        </DialogTitle>
        <DialogContent dividers>
          <div>
            {tags.map(item => (
              <div key={item.id} className={classes.folderItem}>
                {editTagId === item.id ? (
                  <TextField
                    autoFocus
                    className={classes.tagInput}
                    inputProps={{
                      className: classes.tagInputInner,
                    }}
                    placeholder="Input tag name..."
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => submit()}
                    onKeyPress={handleKeyPress}
                  />
                ) : (
                  <>
                    <Label className={`${classes.icon} ${classes.tagIcon}`} />
                    <DeleteForever
                      className={`${classes.icon} ${classes.delIcon}`}
                      onClick={handleDelTag(item)}
                    />
                    <div className={classes.tagText}>{item.name}</div>
                    <Edit
                      className={`${classes.icon} ${classes.editIcon}`}
                      onClick={handleEdit(item)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog disableBackdropClick maxWidth="xs" open={openDel}>
        <DialogContent>
          Are you sure want to delete tag: <strong>{tagToBeDel && tagToBeDel.name}</strong> ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDel(false)} color="default">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelTag} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditTagDialog
