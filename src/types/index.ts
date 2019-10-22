export enum Folders {
  ALL = 'ALL',
  FAVORITES = 'FAVORITES',
  TRASH = 'TRASH',
  TAG = 'TAG',
}

export type FolderKeys = keyof typeof Folders

export const FolderDict: { [key: string]: string } = {
  [Folders.ALL]: 'All Notes',
  [Folders.FAVORITES]: 'Favorites',
  [Folders.TRASH]: 'Trash',
}

export type NoteId = string

export interface Note {
  id: NoteId
  text: string
  createAt: string
  updateAt: string
  tags: string[]
  favorite?: boolean
  trash?: boolean
}

export type Tag = string
