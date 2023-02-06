import { iUser } from '@/interfaces/interface'
import React, { createContext, useState } from 'react'

interface ContextProps {
  user: iUser | null
  setUser: (val: iUser | null) => void
}
export const UserContext = createContext({} as any)

export default function UserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<iUser | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
