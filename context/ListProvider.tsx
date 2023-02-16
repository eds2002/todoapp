import { iList } from '@/interfaces/interface'
import supabase from '@/utils/supabase'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserProvider'

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
  const { user } = useContext(UserContext)
  const [lists, setLists] = useState<iList[]>([])

  const userId = user?.id ?? null
  useGetLists(setLists, userId)

  return (
    <ListContext.Provider value={{ lists, setLists }}>
      {children}
    </ListContext.Provider>
  )
}

function useGetLists(
  setLists: React.Dispatch<React.SetStateAction<iList[]>>,
  userId: number | null,
) {
  useEffect(() => {
    ;(async () => {
      if (!userId) return
      const { data, error, status } = await getLists(userId)
      switch (status) {
        case 200:
          setLists(data as iList[])
          break
      }
    })()
  }, [userId])
}

async function getLists(id: number) {
  return await supabase.from('list').select().eq('userId', id)
}
