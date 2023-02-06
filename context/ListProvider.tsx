import React, { createContext, useState } from 'react'

interface contextProps {
  lists: any
  setLists: any
}

export const ListContext = createContext<contextProps>({} as any)

export default function ListProvider({
  children,
}: {
  children: React.ReactNode
}) {
  interface iList {
    id: number
    name: string
    desc: string
  }
  const [lists, setLists] = useState<iList[]>([])

  return (
    <ListContext.Provider value={{ lists, setLists }}>
      {children}
    </ListContext.Provider>
  )
}
