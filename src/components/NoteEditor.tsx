import { IconButton, Tooltip, Popover, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Favorite, FavoriteBorder, MoreVert } from '@material-ui/icons'
import 'codemirror/addon/selection/active-line'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/idea.css'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js' // from external cdn
import marked from 'marked'
import React, { useEffect, useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { NoteActionType, NoteContainer, SettingContainer, TagContainer } from '../stores'
import { Tag } from '../types'
import ChooseTagMenu from './ChooseTagMenu'

marked.setOptions({
  langPrefix: 'hljs ',
  highlight: function(code) {
    return hljs.highlightAuto(code).value
  },
})

const useStyle = makeStyles({
  root: {
    gridArea: 'editor',
    height: '100vh',
    lineHeight: 1.5,
    padding: '1rem 0 1rem 1rem',
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
    backgroundColor: '#2b2b2b',
    color: '#d0d0d0',
    '& a': {
      color: '#6ab0f3',
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      color: '#ffd479',
    },
  },
  editor: {
    height: 'calc(100vh - 40px - 1rem)',
    overflowY: 'auto',
  },
  statusBar: {
    justifyContent: 'flex-start',
    height: '40px',
    marginLeft: '-1rem',
    padding: '0 1rem',
    backgroundColor: '#e8e8e8',
  },
})

interface NoteEditorProps {}

const NoteEditor: React.FC<NoteEditorProps> = () => {
  const classes = useStyle()
  const [tagMenuAnchorEl, setTagMenuAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { settingState } = SettingContainer.useContainer()
  const { previewMode, darkMode, codeMirrorOptions } = settingState
  const { tagState } = TagContainer.useContainer()
  const { tags } = tagState
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

  return (
    <div className={classes.root}>
      {previewMode ? (
        <div
          className={`${classes.editor} ${darkMode ? classes.dark : ''}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked(activeNote.content)),
          }}
        ></div>
      ) : (
        <CodeMirror
          onDragOver={(editor, event) => {
            event.preventDefault()
          }}
          className={`${classes.editor} ${darkMode ? classes.dark : ''}`}
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
      )}
      <div className={`v-center ${classes.statusBar}`}>
        <Tooltip title={activeNote.favorite ? 'Remove favorite' : 'Mark as favorite'}>
          <IconButton
            size="small"
            onClick={() =>
              noteDispatch({
                type: NoteActionType.EDIT_NOTE,
                payload: { favorite: !activeNote.favorite },
              })
            }
          >
            {activeNote.favorite ? <Favorite color="secondary" /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        {activeNote.tags.length ? (
          <div>
            Tags:
            {activeNote.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
        <IconButton
          aria-describedby="choose-tag-menu"
          onClick={e => setTagMenuAnchorEl(e.currentTarget)}
        >
          <MoreVert />
        </IconButton>
        <Popover
          id="choose-tag-menu"
          open={Boolean(tagMenuAnchorEl)}
          anchorEl={tagMenuAnchorEl}
          onClose={() => setTagMenuAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <ChooseTagMenu note={activeNote} />
        </Popover>
      </div>
    </div>
  )
}

export default NoteEditor
