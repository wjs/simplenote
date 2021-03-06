import {
  IconButton,
  Popover,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Favorite, FavoriteBorder, MoreVert, Delete } from '@material-ui/icons'
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
import { NoteActionType, NoteContainer, SettingContainer } from '../stores'
import ChooseTagMenu from './ChooseTagMenu'
import { delNote } from '../api'

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
    padding: '1rem 0 40px 1rem',
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
      color: '#f05e23',
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
    '& $statusBar': {
      backgroundColor: '#111',
      color: '#d0d0d0',
    },
    '& $statusBtn': {
      color: '#d0d0d0',
    },
    '& $tag': {
      backgroundColor: '#626262',
    },
  },
  editor: {
    height: 'calc(100vh - 40px - 1rem)',
    overflowY: 'auto',
    paddingBottom: '1rem',
  },
  statusBar: {
    justifyContent: 'flex-start',
    height: '40px',
    marginLeft: '-1rem',
    padding: '0 1rem',
    boxShadow: '0px -1px 1px 0px rgba(0,0,0,0.1)',
  },
  statusBtn: {
    height: '40px',
    width: '40px',
    marginLeft: '8px',
    padding: '8px 12px',
  },
  tag: {
    height: '24px',
    lineHeight: '24px',
    padding: '0 .8rem',
    marginLeft: '1rem',
    borderRadius: '12px',
    backgroundColor: '#e8e8e8',
  },
})

interface NoteEditorProps {}

const NoteEditor: React.FC<NoteEditorProps> = () => {
  const classes = useStyle()
  const [tagMenuAnchorEl, setTagMenuAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openDel, setOpenDel] = useState(false)
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

  const handleConfirmDelNote = () => {
    if (activeNote.trash) {
      noteDispatch({ type: NoteActionType.EDIT_NOTE, payload: { trash: true } })
    } else {
      delNote(activeNoteId).then(res => {
        if (!res.error) {
          noteDispatch({ type: NoteActionType.DEL_NOTE, payload: activeNoteId })
        }
      })
    }
    setOpenDel(false)
  }

  return (
    <div className={`${classes.root} ${darkMode ? classes.dark : ''}`}>
      {previewMode ? (
        <div
          className={`markdown-body ${classes.editor}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked(activeNote.text)),
          }}
        ></div>
      ) : (
        <CodeMirror
          onDragOver={(editor, event) => {
            event.preventDefault()
          }}
          className={`${classes.editor}`}
          value={activeNote.text}
          options={codeMirrorOptions}
          editorDidMount={editor => {
            editor.focus()
            editor.setCursor(0)
          }}
          onBeforeChange={(editor, data, value) => {
            noteDispatch({
              type: NoteActionType.EDIT_NOTE,
              payload: {
                text: value,
              },
            })
          }}
          onChange={(editor, data, value) => {
            if (activeNote && activeNote.text === '') {
              editor.focus()
            }
          }}
        />
      )}
      <div className={`v-center ${classes.statusBar}`}>
        <Tooltip title={activeNote.favorite ? 'Remove favorite' : 'Mark as favorite'}>
          <IconButton
            size="small"
            className={classes.statusBtn}
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
        {activeNote.tags.length
          ? activeNote.tags.map(tag => (
              <div key={tag} className={classes.tag}>
                {tag}
              </div>
            ))
          : null}
        <IconButton
          className={classes.statusBtn}
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
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <ChooseTagMenu note={activeNote} />
        </Popover>
        <div className="flex-grow-1"></div>
        <IconButton onClick={() => setOpenDel(true)}>
          <Delete />
        </IconButton>

        <Dialog disableBackdropClick maxWidth="xs" open={openDel}>
          <DialogContent>
            {activeNote.trash
              ? 'Are you sure want to delete this note permanently?'
              : 'Are you sure want to move this note to trash?'}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDel(false)} color="default">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelNote} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default NoteEditor
