import React, { useCallback, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/Text'
import { HiPencil, HiQueueList } from 'react-icons/hi2'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ModalHeader from '@/components/ModalHeader'
import { UserContext } from '@/context/UserProvider'
import { TodosContext } from '@/context/TodosProvider'
import supabase from '@/utils/supabase'
import { iTodo } from '@/interfaces/interface'

const inputs = [
  {
    id: 1,
    name: 'todoName',
    placeHolder: 'Pick up birthday cake',
    errorMsg: ''
  },
  {
    id: 2,
    name: 'todoDueDate',
    placeHolder: 'Pick up birthday cake',
    type: 'datetime-local',
    errorMsg: ''
  }
]

async function updateTodo(id: number, update: any) {
  try {
    const { status } = await supabase.from('todo').update(update).eq('id', id)
    return [status, null]
  } catch (error) {
    return [null, error]
  }
}

export default function EditTodo({
  setState,
  data
}: {
  setState: (val: boolean) => void
  data: iTodo
}) {
  const { user } = useContext(UserContext)
  const { setTodos } = useContext(TodosContext)
  const [inputData, setInputData] = useState<any>({
    todoName: data.name,
    todoDueDate: data.due_by
  })
  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }

  const handleSubmit = async (e: any) => {
    if (!inputData?.todoName) return //If there is no title, return
    if (!inputData?.todoDueDate) return //If there is no title, return
    if (!user?.id) return //NOTE: This seems kinda sloppy to avoid ts error, come back to this.
    if (
      inputData.todoName === data.name &&
      inputData.todoDueDate === data.due_by
    ) {
      setState(false)
      return
    }

    let updateQuery: any = {} //Creates an object query for supabase, only changing whats edited
    if (inputData.todoName !== data.name) {
      updateQuery['name'] = inputData.todoName
    }
    if (inputData.todoDueDate !== data.due_by) {
      updateQuery['dueBy'] = inputData.todoDueDate
    }

    const [updateStatus, error] = await updateTodo(data.id, updateQuery)

    switch (String(updateStatus).charAt(0)) {
      case '2': {
        setTodos((oldTodos: iTodo[]) =>
          oldTodos.map(todo =>
            todo.id === data.id
              ? {
                  ...todo,
                  name: inputData.todoName,
                  dueBy: inputData.todoDueDate
                }
              : todo
          )
        )
        setState(false)
        break
      }
      default: {
        console.log(updateStatus, error)
        break
      }
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-screen max-w-sm p-6 rounded-3xl bg-primary"
      >
        <ModalHeader setState={setState} />
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
          <HiPencil className="w-8 h-8 text-text" />
        </div>
        <Text
          style="heading"
          type="h1"
          className="mb-2"
        >
          Edit todo
        </Text>
        {inputs.map(props => (
          <Input
            key={props.id}
            {...props}
            defaultValue={props.id === 2 ? data.due_by : data.name}
            onChange={onChange}
          />
        ))}
        <Button
          type="default"
          className="w-full"
          onClick={e => handleSubmit(e)}
        >
          Edit todo
        </Button>
      </motion.div>
    </motion.div>
  )
}
