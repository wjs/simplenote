import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { Tag } from '../types'
import { saveTags } from '../api'

export interface TagState {
  tags: Tag[]
}

export const initialTagState: TagState = {
  tags: [],
}

export enum TagActionType {
  ADD_TAG = 'ADD_TAG',
  DEL_TAG = 'DEL_TAG',
  EDIT_TAG = 'EDIT_TAG',
  LOAD_TAGS = 'LOAD_TAGS',
}

export type TagAction =
  | { type: TagActionType.ADD_TAG; payload: string }
  | { type: TagActionType.DEL_TAG; payload: Tag }
  | { type: TagActionType.EDIT_TAG; payload: { index: number; newTag: Tag } }
  | { type: TagActionType.LOAD_TAGS; payload: Tag[] }

function tagsReducer(state: TagState, action: TagAction): TagState {
  let newState = state
  switch (action.type) {
    case TagActionType.ADD_TAG:
      newState = { ...state, tags: [...state.tags, action.payload] }
      break
    case TagActionType.DEL_TAG:
      newState = { ...state, tags: state.tags.filter(x => x !== action.payload) }
      break
    case TagActionType.EDIT_TAG:
      const { index, newTag } = action.payload
      newState = {
        ...state,
        tags: [...state.tags.slice(0, index), newTag, ...state.tags.slice(index + 1)],
      }
      break
    case TagActionType.LOAD_TAGS:
      newState = { ...state, tags: action.payload }
      break
  }
  if (action.type !== TagActionType.LOAD_TAGS) {
    saveTags(newState.tags)
  }
  return newState
}

function useTags(initial: TagState = initialTagState) {
  const [state, dispatch] = useReducer(tagsReducer, initial)
  return { tagState: state, tagDispatch: dispatch }
}

export const TagContainer = createContainer(useTags)
