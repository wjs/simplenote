import axios from 'axios'
import { Note, Tag } from '../types'

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

export const saveNote = async (params: Partial<Note>) => {
  return axios.post('/api/saveNote', params).then(res => res.data)
}
