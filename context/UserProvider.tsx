import { iUser } from '@/interfaces/interface'
import React, { createContext, useState } from 'react'

interface ContextProps {
  user: iUser | null
  setUser: (val: iUser | null) => void
}
export const UserContext = createContext<ContextProps>({} as any)

export default function UserProvider({
  children,
  userDecoded
}: {
  children: React.ReactNode
  userDecoded: iUser
}) {
  const [user, setUser] = useState<iUser | null>(userDecoded)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
