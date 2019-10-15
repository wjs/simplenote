import { useState } from 'react'
import { createContainer } from 'unstated-next'
import { TagState, Tag } from '../types'

const DefaultTagState: TagState = {
  tags: ['aaa', 'bbb', 'ccc'],
  error: '',
  loading: false,
}

function useTags(initial: TagState = DefaultTagState) {
  const [store, setStore] = useState<TagState>(initial)

  const syncStore = (updator: Partial<TagState>) => {
    // TODO: save to localstorage
    setStore({
      ...store,
      ...updator,
    })
  }

  const addTag = (tag: Tag) => {
    syncStore({ tags: [...store.tags, tag] })
  }

  const delTag = (tag: Tag) => {
    syncStore({ tags: store.tags.filter(x => x !== tag) })
  }

  const { tags, error, loading } = store

  return { tags, error, loading, addTag, delTag }
}

export const TagContainer = createContainer(useTags)
