import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { Tag } from '../types'

export interface TagState {
  tags: Tag[]
}

export const initialTagState: TagState = {
  tags: ['aaa', 'bbb', 'ccc'],
}

export enum TagActionType {
  ADD_TAG = 'ADD_TAG',
  DEL_TAG = 'DEL_TAG',
  EDIT_TAG = 'EDIT_TAG',
}

export type TagAction =
  | { type: TagActionType.ADD_TAG; payload: string }
  | { type: TagActionType.DEL_TAG; payload: Tag }
  | { type: TagActionType.EDIT_TAG; payload: { index: number; newTag: Tag } }

function tagsReducer(state: TagState, action: TagAction): TagState {
  switch (action.type) {
    case TagActionType.ADD_TAG:
      return { ...state, tags: [...state.tags, action.payload] }
    case TagActionType.DEL_TAG:
      return { ...state, tags: state.tags.filter(x => x !== action.payload) }
    case TagActionType.EDIT_TAG:
      const { index, newTag } = action.payload
      return {
        ...state,
        tags: [...state.tags.slice(0, index), newTag, ...state.tags.slice(index + 1)],
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
