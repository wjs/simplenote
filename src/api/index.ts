import axios from 'axios'
import { Note, Tag, NoteId } from '../types'

export const NOTE_STORAGE_KEY = 'simplenote-notes'
export const TAG_STORAGE_KEY = 'simplenote-tags'
export const LAST_NOTE_ID = 'simplenote-last-note-id'

export const getNotes = async () => {
  let data
  try {
    data = await localStorage.getItem(NOTE_STORAGE_KEY)
  } catch (error) {}
  return data ? JSON.parse(data) : []
}

export const getTags = async () => {
  let data
  try {
    data = await localStorage.getItem(TAG_STORAGE_KEY)
  } catch (error) {}
  return data ? JSON.parse(data) : []
}

export const saveData = (notes: Note[], tags: Tag[]) => {
  localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes))
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags))
}

export const getInit = async () => {
  let url = '/api/init'
  const noteId = await localStorage.getItem(LAST_NOTE_ID)
  if (noteId) {
    url += `?noteId=${noteId}`
  }
  return axios.get(url).then(res => res.data)
}

export const saveNoteMeta = async (params: Partial<Note>) => {
  return axios.post('/api/saveNoteMeta', params).then(res => res.data)
}

export const saveNoteContent = async (params: { id: string; text: string }) => {
  return axios.post('/api/saveNoteContent', params).then(res => res.data)
}

export const delNote = async (id: NoteId) => {
  return axios.post('/api/delNote', id).then(res => res.data)
}

export const saveTags = async (tags: Tag[]) => {
  return axios.post('/api/saveTags', tags).then(res => res.data)
}
