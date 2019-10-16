import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { Tag } from '../types'

export enum TagActionType {
  SHOW_ADD_TAG_INPUT = 'SHOW_ADD_TAG_INPUT',
  HIDE_ADD_TAG_INPUT = 'HIDE_ADD_TAG_INPUT',
  ADD_TAG = 'ADD_TAG',
  DEL_TAG = 'DEL_TAG',
}

export type TagAction =
  | { type: TagActionType.SHOW_ADD_TAG_INPUT }
  | { type: TagActionType.HIDE_ADD_TAG_INPUT }
  | { type: TagActionType.ADD_TAG; payload: Tag }
  | { type: TagActionType.DEL_TAG; payload: Tag }

export interface TagState {
  tags: Tag[]
  showAddTagInput: boolean
  addTagValue: string
}

export const initialTagState: TagState = {
  tags: ['aaa', 'bbb', 'ccc'],
  showAddTagInput: false,
  addTagValue: '',
}

export function tagsReducer(state: TagState, action: TagAction): TagState {
  switch (action.type) {
    case TagActionType.SHOW_ADD_TAG_INPUT:
      return { ...state, showAddTagInput: true }
    case TagActionType.HIDE_ADD_TAG_INPUT:
      return { ...state, showAddTagInput: false }
    case TagActionType.ADD_TAG:
      return { ...state, tags: [...state.tags, action.payload] }
    case TagActionType.DEL_TAG:
      return { ...state, tags: state.tags.filter(x => x !== action.payload) }
    default:
      return state
  }
}

function useTags(initial: TagState = initialTagState) {
  const [state, dispatch] = useReducer(tagsReducer, initial)
  return { tagState: state, tagDispatch: dispatch }
}

export const TagContainer = createContainer(useTags)
