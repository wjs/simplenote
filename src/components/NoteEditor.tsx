import DOMPurify from 'dompurify'
import marked from 'marked'
import React, { useEffect } from 'react'
import { NoteActionType, NoteContainer } from '../stores'
import { makeStyles } from '@material-ui/core/styles'

const useStyle = makeStyles({
  root: {
    height: '100%',
    padding: '1rem',
    lineHeight: 1.5,
    fontSize: '15px',
    fontFamily: 'Menlo,Monaco,monospace',
    '-webkit-font-smoothing': 'subpixel-antialiased',
  },
})

interface NoteEditorProps {}

const NoteEditor: React.FC<NoteEditorProps> = () => {
  const classes = useStyle()
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { notes, activeNoteId } = noteState

  useEffect(() => {
    if (!activeNoteId && notes.length) {
      let n = notes.find(x => !x.trash)
      if (!n) {
        n = notes[0]
      }
      noteDispatch({ type: NoteActionType.CHOOSE_NOTE, payload: n.id })
    }
  })

  const note = notes.find(x => x.id === activeNoteId)
  if (!note) {
    return null
  }

  return (
    <div
      className={classes.root}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(note.content)) }}
    ></div>
  )
}

export default NoteEditor
