import { useRef, useEffect } from 'react'

export const getNoteTitle = (text: string): string => {
  const matches = text.match(/[^#]{1,50}/)
  return matches ? matches[0].split(/\r?\n/)[0] : 'New Note'
}

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(() => {})

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
