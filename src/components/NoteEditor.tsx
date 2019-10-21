import { makeStyles } from '@material-ui/core/styles'
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/vim'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/idea.css'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js' // from external cdn
import marked from 'marked'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import React, { useEffect } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { NoteActionType, NoteContainer, SettingContainer } from '../stores'

marked.setOptions({
  langPrefix: 'hljs ',
  highlight: function(code) {
    return hljs.highlightAuto(code).value
  },
})

const useStyle = makeStyles({
  root: {
    gridArea: 'editor',
    maxHeight: '100vh',
    overflowY: 'auto',
    lineHeight: 1.5,
    padding: '1rem',
    fontSize: '15px',
    fontFamily: 'Menlo,Monaco,monospace',
    '-webkit-font-smoothing': 'subpixel-antialiased',
    '& a': {
      color: '#5183f5',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      margin: '0 0 1.5rem',
    },
  },
  dark: {
    backgroundColor: '#3f3f3f',
    color: '#d0d0d0',
    '& a': {
      color: '#6ab0f3',
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      color: '#ffd479',
    },
  },
})

interface NoteEditorProps {}

const NoteEditor: React.FC<NoteEditorProps> = () => {
  const classes = useStyle()
  const { settingState } = SettingContainer.useContainer()
  const { previewMode, darkMode, codeMirrorOptions } = settingState
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

  const activeNote = notes.find(x => x.id === activeNoteId)
  if (!activeNote) {
    return null
  }

  if (previewMode) {
    return (
      <div
        className={`${classes.root} ${darkMode ? classes.dark : ''}`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(activeNote.content)),
        }}
      ></div>
    )
  }

  return (
    <CodeMirror
      onDragOver={(editor, event) => {
        event.preventDefault()
        console.log(editor)
      }}
      className={classes.root}
      value={activeNote.content}
      options={codeMirrorOptions}
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

export default NoteEditor
