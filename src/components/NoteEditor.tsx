import { makeStyles } from '@material-ui/core/styles'
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/vim'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/theme/idea.css'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js' // from external cdn
import marked from 'marked'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import React, { useEffect, useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { NoteActionType, NoteContainer } from '../stores'

marked.setOptions({
  langPrefix: 'hljs ',
  highlight: function(code) {
    return hljs.highlightAuto(code).value
  },
})

const CodeMirrorOptions = {
  mode: 'gfm',
  theme: 'idea',
  lineNumbers: false,
  lineWrapping: true,
  styleActiveLine: { nonEmpty: true },
  viewportMargin: Infinity,
  keyMap: 'default',
  dragDrop: false,
}

const useStyle = makeStyles({
  root: {
    height: '100%',
    padding: '1rem',
    overflowY: 'auto',
    lineHeight: 1.5,
    fontSize: '15px',
    fontFamily: 'Menlo,Monaco,monospace',
    '-webkit-font-smoothing': 'subpixel-antialiased',
  },
})

interface NoteEditorProps {}

const NoteEditor: React.FC<NoteEditorProps> = () => {
  const classes = useStyle()
  const [isEdit, setIsEdit] = useState(false)
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

    Mousetrap.bindGlobal('esc', function() {
      setIsEdit(false)
      return false
    })
    Mousetrap.bindGlobal('ctrl+e', function() {
      setIsEdit(true)
      return false
    })
  })

  const activeNote = notes.find(x => x.id === activeNoteId)
  if (!activeNote) {
    return null
  }

  if (isEdit) {
    return (
      <CodeMirror
        onDragOver={(editor, event) => {
          event.preventDefault()
          console.log(editor)
        }}
        className="editor mousetrap"
        value={activeNote.content}
        options={CodeMirrorOptions}
        editorDidMount={editor => {
          editor.focus()
          editor.setCursor(0)
        }}
        onBeforeChange={(editor, data, value) => {
          noteDispatch({
            type: NoteActionType.EDIT_NOTE,
            payload: {
              content: value,
            },
          })
        }}
        onChange={(editor, data, value) => {
          if (activeNote && activeNote.content === '') {
            editor.focus()
          }
        }}
      />
    )
  }

  return (
    <div
      className={classes.root}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(activeNote.content)),
      }}
    ></div>
  )
}

export default NoteEditor
