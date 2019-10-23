import { useRef, useEffect } from 'react'
import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

export const getNoteTitle = (text: string): string => {
  const matches = text.match(/[^#]{1,50}/)
  return matches ? matches[0].split(/\r?\n/)[0] : 'New Note'
}

const noop = () => {}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(noop)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const handler = () => savedCallback.current()
    if (delay) {
      const id = setInterval(handler, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export function useKey(key: string | string[], action: () => void) {
  const savedAction = useRef(noop)
  savedAction.current = action

  useEffect(() => {
    mousetrap.bindGlobal(key, () => {
      if (savedAction.current) {
        savedAction.current()
      }
      return false
    })
    return () => {
      mousetrap.unbind(key)
    }
  }, [key])
}
