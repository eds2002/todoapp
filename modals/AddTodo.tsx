import React, { useCallback, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/Text'
import { HiQueueList } from 'react-icons/hi2'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ModalHeader from '@/components/ModalHeader'
import { UserContext } from '@/context/UserProvider'
import { TodosContext } from '@/context/TodosProvider'
import supabase from '@/utils/supabase'
import { iTodo } from '@/interfaces/interface'
import { DateTime } from 'luxon'

async function insertTodo(
  listId: number | undefined,
  name: string,
  dueBy: string,
  isCompleted: boolean,
) {
  return await supabase
    .from('todo')
    .insert({
      list_id: listId,
      name: name,
      due_by: dueBy,
      is_completed: isCompleted,
    })
    .select()
}

export default function AddTodo({
  setState,
  listId,
}: {
  setState: (val: boolean) => void
  listId: number
}) {
  const { user } = useContext(UserContext)
  const { setTodos } = useContext(TodosContext)
  const [inputData, setInputData] = useState<any>({})
  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: 'todoName',
      placeHolder: 'Pick up birthday cake',
      errorMsg: '',
    },
    {
      id: 2,
      name: 'todoDueDate',
      placeHolder: 'Pick up birthday cake',
      type: 'datetime-local',
      errorMsg: '',
    },
  ])
  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }

  const handleSubmit = async (e: any) => {
    if (!inputData?.todoName) {
      setInputs(inputs =>
        inputs.map(input =>
          input.id === 1
            ? { ...input, errorMsg: 'Input cannot be blank.' }
            : input,
        ),
      )
      return
    } //If there is no title, return
    if (!inputData?.todoDueDate) {
      setInputs(inputs =>
        inputs.map(input =>
          input.id === 2
            ? { ...input, errorMsg: 'Please pick a valid date.' }
            : input,
        ),
      )
      return
    } //If there is no title, return
    if (
      DateTime.fromISO(inputData.todoDueDate).valueOf() <
      DateTime.now().valueOf()
    ) {
      setInputs(inputs =>
        inputs.map(input =>
          input.id === 2
            ? {
                ...input,
                errorMsg: 'Invalid date, pick a date greater than today.',
              }
            : input,
        ),
      )
      return
    }
    setInputs(inputs => inputs.map(input => ({ ...input, errorMsg: '' }))) //Clear error messages
    const { data, error, status } = await insertTodo(
      listId,
      inputData.todoName,
      inputData.todoDueDate,
      false,
    )

    switch (status) {
      case 201:
        setTodos((oldTodos: iTodo[]) => [...oldTodos, ...(data as any)])
        setState(false)
        break
      default:
        setState(false)
        break
    }
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/80"
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
          <HiQueueList className="w-8 h-8 text-text" />
        </div>
        <Text
          style="heading"
          type="h1"
          className="mb-2"
        >
          Create a new todo
        </Text>
        {inputs.map(props => (
          <Input
            key={props.id}
            {...props}
            onChange={onChange}
          />
        ))}
        <Button
          type="default"
          className="w-full"
          onClick={e => handleSubmit(e)}
        >
          Create todo
        </Button>
      </motion.div>
    </motion.div>
  )
}
