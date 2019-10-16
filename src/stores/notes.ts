import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { FolderKeys, Folders, Note, Tag } from '../types'

export enum NoteActionType {
  CHOOSE_FOLDER = 'CHOOSE_FOLDER',
  CHOOSE_TAG = 'CHOOSE_TAG',
  CHOOSE_NOTE = 'CHOOSE_NOTE',
  ADD_NOTE = 'ADD_NOTE',
}

export type NoteAction =
  | { type: NoteActionType.CHOOSE_FOLDER; payload: FolderKeys }
  | { type: NoteActionType.CHOOSE_TAG; payload: Tag }
  | { type: NoteActionType.CHOOSE_NOTE; payload: Tag }
  | { type: NoteActionType.ADD_NOTE; payload: Note }

export interface NoteState {
  notes: Note[]
  activeFolder: FolderKeys
  activeTag: Tag
  activeNoteId: string
  error: string
  loading: boolean
}

export const initialNoteState: NoteState = {
  notes: [],
  activeFolder: Folders.ALL,
  activeTag: '',
  activeNoteId: '',
  error: '',
  loading: false,
}

export function notesReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case NoteActionType.CHOOSE_FOLDER:
      return { ...state, activeFolder: action.payload, activeTag: '' }
    case NoteActionType.CHOOSE_TAG:
      return { ...state, activeFolder: Folders.TAG, activeTag: action.payload }
    case NoteActionType.CHOOSE_NOTE:
      return { ...state, activeNoteId: action.payload }
    case NoteActionType.ADD_NOTE:
      return { ...state, notes: [...state.notes, action.payload] }
    default:
      return state
  }
}

function useNotes(initial: NoteState = initialNoteState) {
  const [state, dispatch] = useReducer(notesReducer, initial)
  return { noteState: state, noteDispatch: dispatch }
}

export const NoteContainer = createContainer(useNotes)
