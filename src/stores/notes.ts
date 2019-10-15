import { useState } from 'react'
import { createContainer } from 'unstated-next'
import uuid from 'uuid'
import { NoteState, Note, Folders, FolderKeys } from '../types'

const DefaultNoteState: NoteState = {
  notes: [],
  activeFolder: Folders.ALL,
  activeCategoryId: '',
  activeNoteId: '',
  error: '',
  loading: false,
}

function useNotes(initial: NoteState = DefaultNoteState) {
  const [store, setStore] = useState<NoteState>(initial)

  const syncStore = (updator: Partial<NoteState>) => {
    // TODO: save to localstorage
    setStore({
      ...store,
      ...updator,
    })
  }

  const addNote = (note: Note) => {
    syncStore({ notes: [...store.notes, note] })
  }

  const changeActiveFolder = (folder: FolderKeys) => {
    syncStore({ activeFolder: folder })
  }

  const { notes, activeFolder, loading } = store

  return { notes, activeFolder, loading, addNote, changeActiveFolder }
}

export const NoteContainer = createContainer(useNotes)
