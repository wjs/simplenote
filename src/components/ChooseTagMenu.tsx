import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TagContainer, NoteContainer, NoteActionType } from '../stores'
import { Tag, Note } from '../types'
import { Label, DeleteForever, Edit } from '@material-ui/icons'
import { FormControlLabel, Checkbox } from '@material-ui/core'

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
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
  },
  tagInputInner: {
    padding: '.5rem .8rem',
  },
})
interface ChooseTagMenuProps {
  note: Note
}

const ChooseTagMenu: React.FC<ChooseTagMenuProps> = ({ note }) => {
  const classes = useStyles()
  const { noteDispatch } = NoteContainer.useContainer()
  const { tagState, tagDispatch } = TagContainer.useContainer()
  const { tags } = tagState

  const handleSelect = (tag: Tag) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    let newTags: Tag[] = []
    if (checked) {
      newTags = [...note.tags, tag]
    } else {
      newTags = note.tags.filter(x => x !== tag)
    }
    noteDispatch({ type: NoteActionType.EDIT_NOTE, payload: { tags: newTags } })
  }

  return (
    <div>
      {tags.map((item: Tag, i: number) => {
        const checked = note.tags.indexOf(item) > -1
        return (
          <FormControlLabel
            key={i}
            control={<Checkbox checked={checked} onChange={handleSelect(item)} value={item} />}
            label={item}
          />
        )
      })}
    </div>
  )
}

export default ChooseTagMenu
