export enum Folders {
  ALL = 'ALL',
  FAVORITES = 'FAVORITES',
  TRASH = 'TRASH',
}

export type FolderKeys = keyof typeof Folders

export const FolderDict: { [key: string]: string } = {
  [Folders.ALL]: 'All Notes',
  [Folders.FAVORITES]: 'Favorites',
  [Folders.TRASH]: 'Trash',
}

export interface Note {
  id: string
  content: string
  createAt: string
  updateAt: string
  tags: string[]
  favorite?: boolean
  trash?: boolean
}

export type Tag = string

export interface NoteState {
  notes: Note[]
  activeFolder: string
  activeTag: Tag
  activeNoteId: string
  error: string
  loading: boolean
}

export interface TagState {
  tags: Tag[]
  error: string
  loading: boolean
}
