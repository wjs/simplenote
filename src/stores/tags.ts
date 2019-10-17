import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { Tag, TagId } from '../types'
import uuid from 'uuid'

export enum TagActionType {
  ADD_TAG = 'ADD_TAG',
  DEL_TAG = 'DEL_TAG',
  EDIT_TAG = 'EDIT_TAG',
}

export type TagAction =
  | { type: TagActionType.ADD_TAG; payload: string }
  | { type: TagActionType.DEL_TAG; payload: TagId }
  | { type: TagActionType.EDIT_TAG; payload: Tag }

export interface TagState {
  tags: Tag[]
}

export const initialTagState: TagState = {
  tags: [
    { id: uuid.v4(), name: 'aaa' },
    { id: uuid.v4(), name: 'bbb' },
    { id: uuid.v4(), name: 'ccc' },
  ],
}

export function tagsReducer(state: TagState, action: TagAction): TagState {
  switch (action.type) {
    case TagActionType.ADD_TAG:
      const newTag = { id: uuid.v4(), name: action.payload }
      return { ...state, tags: [...state.tags, newTag] }
    case TagActionType.DEL_TAG:
      return { ...state, tags: state.tags.filter(x => x.id !== action.payload) }
    case TagActionType.EDIT_TAG:
      const idx = state.tags.findIndex(x => x.id === action.payload.id)
      return {
        ...state,
        tags: [...state.tags.slice(0, idx), action.payload, ...state.tags.slice(idx + 1)],
      }
    default:
      return state
  }
}

function useTags(initial: TagState = initialTagState) {
  const [state, dispatch] = useReducer(tagsReducer, initial)
  return { tagState: state, tagDispatch: dispatch }
}

export const TagContainer = createContainer(useTags)
