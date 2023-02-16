import { createContext, ReactNode, useState } from 'react'

interface contextProps {
  todos: any
  setTodos: any
}

export const TodosContext = createContext<contextProps>({} as any)

export default function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState([])
  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  )
}
