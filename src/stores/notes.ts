import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { FolderKeys, Folders, Note, NoteId, Tag } from '../types'
import uuid from 'uuid'
import { LAST_NOTE_ID, saveNote } from '../api'

export enum NoteActionType {
  CHOOSE_FOLDER = 'CHOOSE_FOLDER',
  CHOOSE_TAG = 'CHOOSE_TAG',
  CHOOSE_NOTE = 'CHOOSE_NOTE',
  ADD_NOTE = 'ADD_NOTE',
  EDIT_NOTE = 'EDIT_NOTE',
  LOAD_NOTES = 'LOAD_NOTES',
}

export type NoteAction =
  | { type: NoteActionType.CHOOSE_FOLDER; payload: FolderKeys }
  | { type: NoteActionType.CHOOSE_TAG; payload: Tag }
  | { type: NoteActionType.CHOOSE_NOTE; payload: NoteId }
  | { type: NoteActionType.ADD_NOTE }
  | { type: NoteActionType.EDIT_NOTE; payload: Partial<Note> }
  | { type: NoteActionType.LOAD_NOTES; payload: Note[] }

export interface NoteState {
  notes: Note[]
  activeFolder: FolderKeys
  activeTag: Tag | null
  activeNoteId: NoteId
  error: string
  loading: boolean
}

export const initialNoteState: NoteState = {
  notes: [],
  activeFolder: Folders.ALL,
  activeTag: null,
  activeNoteId: '',
  error: '',
  loading: false,
}

function notesReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case NoteActionType.CHOOSE_FOLDER:
      return { ...state, activeFolder: action.payload, activeTag: null }
    case NoteActionType.CHOOSE_TAG:
      return { ...state, activeFolder: Folders.TAG, activeTag: action.payload }
    case NoteActionType.CHOOSE_NOTE:
      localStorage.setItem(LAST_NOTE_ID, action.payload)
      return { ...state, activeNoteId: action.payload }
    case NoteActionType.ADD_NOTE:
      const now = new Date().toISOString()
      const newNote: Note = {
        id: uuid.v4(),
        text: '',
        tags: [],
        createAt: now,
        updateAt: now,
      }
      if (state.activeTag) {
        newNote.tags.push(state.activeTag)
      }
      saveNote(newNote)
      return { ...state, notes: [...state.notes, newNote], activeNoteId: newNote.id }
    case NoteActionType.EDIT_NOTE:
      const idx = state.notes.findIndex(x => x.id === state.activeNoteId)
      saveNote({ id: state.notes[idx].id, ...action.payload, updateAt: new Date().toISOString() })
      return {
        ...state,
        notes: [
          ...state.notes.slice(0, idx),
          {
            ...state.notes[idx],
            ...action.payload,
            updateAt: new Date().toISOString(),
          },
          ...state.notes.slice(idx + 1),
        ],
      }
    case NoteActionType.LOAD_NOTES:
      return { ...state, notes: action.payload }
    default:
      return state
  }
}

function useNotes(initial: NoteState = initialNoteState) {
  const [state, dispatch] = useReducer(notesReducer, initial)
  return { noteState: state, noteDispatch: dispatch }
}

export const NoteContainer = createContainer(useNotes)
