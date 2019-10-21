import { useReducer } from 'react'
import { createContainer } from 'unstated-next'

export interface SettingState {
  isOpen: boolean
  previewMode: boolean
  darkMode: boolean
  codeMirrorOptions: {
    mode: string
    theme: string
    lineNumbers: boolean
    lineWrapping: boolean
    styleActiveLine: { nonEmpty: boolean }
    viewportMargin: number
    keyMap: string
    dragDrop: boolean
  }
}

export const initialSettingState: SettingState = {
  isOpen: false,
  previewMode: true,
  darkMode: false,
  codeMirrorOptions: {
    mode: 'gfm',
    theme: 'idea',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
    keyMap: 'default',
    dragDrop: false,
  },
}

export enum SettingActionType {
  TOGGLE_SETTING_DIALOG = 'TOGGLE_SETTING_DIALOG',
  TOGGLE_PREVIEW_MODE = 'TOGGLE_PREVIEW_MODE',
  TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE',
}

export type SettingAction =
  | { type: SettingActionType.TOGGLE_SETTING_DIALOG }
  | { type: SettingActionType.TOGGLE_PREVIEW_MODE; payload?: boolean }
  | { type: SettingActionType.TOGGLE_DARK_MODE }

function settingReducer(state: SettingState, action: SettingAction) {
  switch (action.type) {
    case SettingActionType.TOGGLE_SETTING_DIALOG:
      return { ...state, isOpen: !state.isOpen }
    case SettingActionType.TOGGLE_PREVIEW_MODE:
      return {
        ...state,
        previewMode: action.payload !== undefined ? action.payload : !state.previewMode,
      }
    case SettingActionType.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
        codeMirrorOptions: {
          ...state.codeMirrorOptions,
          theme: state.darkMode ? 'idea' : 'dracula',
        },
      }
    default:
      return state
  }
}

function useSetting(initial: SettingState = initialSettingState) {
  const [state, dispatch] = useReducer(settingReducer, initial)
  return { settingState: state, settingDispatch: dispatch }
}

export const SettingContainer = createContainer(useSetting)
