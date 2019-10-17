import { IconButton, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Edit, Label } from '@material-ui/icons'
import React, { useState } from 'react'
import { NoteActionType, NoteContainer, TagContainer } from '../stores'
import { Tag } from '../types'
import EditTagDialog from './EditTagDialog'

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
    },
    '&.active': {
      backgroundColor: '#101010',
    },
  },
  tagIcon: {
    marginRight: '.5rem',
    fontSize: '1.1rem',
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
      fontSize: '0.8rem',
    },
  },
  editBtn: {
    padding: '.35rem',
    color: 'rgba(255,255,255,.8)',
    '&:hover': {
      backgroundColor: '#555',
      color: '#fff',
    },
  },
  editIcon: {
    fontSize: '1rem',
  },
})

interface TagListProps {}

const TagList: React.FC<TagListProps> = () => {
  const classes = useStyles()
  const [openEdit, setOpenEdit] = useState(false)
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeTag } = noteState
  const { tagState } = TagContainer.useContainer()
  const { tags } = tagState

  const handleChooseTag = (tag: Tag) => () => {
    noteDispatch({ type: NoteActionType.CHOOSE_TAG, payload: tag })
  }

  return (
    <>
      <div className={classes.tagTitle}>
        <h3>Tags</h3>
        <Tooltip title="Edit tags">
          <IconButton size="small" className={classes.editBtn} onClick={() => setOpenEdit(true)}>
            <Edit className={classes.editIcon} />
          </IconButton>
        </Tooltip>
      </div>

      <div>
        {tags.map(item => (
          <div
            key={item.id}
            className={`${classes.folderItem} ${activeTag === item ? 'active' : ''}`}
            onClick={handleChooseTag(item)}
          >
            <Label className={`${classes.tagIcon} tag-icon`} />
            <span className={classes.tagText}>{item.name}</span>
          </div>
        ))}

        <EditTagDialog open={openEdit} handleClose={() => setOpenEdit(false)} />
      </div>
    </>
  )
}

export default TagList
