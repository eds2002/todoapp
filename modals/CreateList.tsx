import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/Text'
import { HiQueueList } from 'react-icons/hi2'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ModalHeader from '@/components/ModalHeader'
import supabase from '@/utils/supabase'
import { UserContext } from '@/context/UserProvider'
import { ListContext } from '@/context/ListProvider'

async function insertList(
  userId: number,
  name: string,
  color: null,
  description: string
) {
  return await supabase
    .from('list')
    .insert({ name, userId, color: null, description })
    .select()
}

async function findList(requestedName: string) {
  return await supabase.from('list').select().eq('name', requestedName)
}

export default function CreateList({
  setState
}: {
  setState: (val: boolean) => void
}) {
  const { user } = useContext(UserContext)
  const { setLists } = useContext(ListContext)
  const [inputData, setInputData] = useState<any>({})
  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }
  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: 'listName',
      placeHolder: 'List name',
      errorMsg: ''
    }
  ])

  const handleSubmit = async (e: any) => {
    if (!inputData?.listName) return //If there is no title, return
    const listName = inputData.listName
    const listDesc = inputData.description

    // Handle duplicate lists
    const { data: requestedListName } = await findList(listName)
    if (requestedListName?.length !== 0) {
      setInputs(oldInput =>
        oldInput.map(input =>
          input.id === 1
            ? { ...input, errorMsg: 'List name already taken. Pick another.' }
            : input
        )
      )
      return
    }

    if (!user?.id) return //NOTE: This seems kinda sloppy to avoid ts error, come back to this.
    const { data, error, status } = await insertList(
      user.id,
      listName,
      null,
      listDesc
    )

    switch (status) {
      case 201:
        setLists((oldLists: any) => [...oldLists, ...(data as any)])
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
          Create my list
        </Text>
        {inputs.map(props => (
          <Input
            key={props.id}
            {...props}
            onChange={onChange}
          />
        ))}
        <TextArea
          defaultValue={''}
          placeholder="List description (Optional)"
          onChange={onChange}
        />
        <Button
          type="default"
          className="w-full"
          onClick={e => handleSubmit(e)}
        >
          Create list
        </Button>
      </motion.div>
    </motion.div>
  )
}
