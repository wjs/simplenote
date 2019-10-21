import { Checkbox, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { NoteActionType, NoteContainer, TagContainer } from '../stores'
import { Note, Tag } from '../types'

const useStyles = makeStyles({
  root: {
    padding: '.5rem 1rem',
  },
  tagInput: {
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
  },
  tagInputInner: {
    padding: '.5rem .8rem',
  },
  option: {
    display: 'block',
  },
})
interface ChooseTagMenuProps {
  note: Note
}

const ChooseTagMenu: React.FC<ChooseTagMenuProps> = ({ note }) => {
  const classes = useStyles()
  const { noteDispatch } = NoteContainer.useContainer()
  const { tagState } = TagContainer.useContainer()
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
    <div className={classes.root}>
      {tags.map((item: Tag, i: number) => {
        const checked = note.tags.indexOf(item) > -1
        return (
          <FormControlLabel
            key={i}
            className={classes.option}
            control={<Checkbox checked={checked} onChange={handleSelect(item)} value={item} />}
            label={item}
          />
        )
      })}
    </div>
  )
}

export default ChooseTagMenu
