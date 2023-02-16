export interface iUser {
  id: number
  firstName: string
  lastName: string
  nickname: string | null
  email: string
}

export interface iList {
  id: number
  name: string
  description: string
  total: number | undefined
  created_at: string
}

export interface iTodo {
  id: number
  list_id: number
  name: string
  due_by: string
  is_completed: boolean
  created_at: string
}
