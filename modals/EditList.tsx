import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/Text'
import { HiQueueList } from 'react-icons/hi2'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ModalHeader from '@/components/ModalHeader'
import supabase from '@/utils/supabase'
import { ListContext } from '@/context/ListProvider'
import { iList } from '@/interfaces/interface'

async function updateList(id: number, update: any) {
  try {
    const { status } = await supabase.from('list').update(update).eq('id', id)
    return [status, null]
  } catch (error) {
    return [null, error]
  }
}

async function findList(requestedName: string) {
  return await supabase.from('list').select().eq('name', requestedName)
}

export default function EdtList({
  setState,
  name,
  description,
  id,
}: {
  setState: (val: boolean) => void
  name: string
  description: string | any
  id: number
}) {
  const { setLists } = useContext(ListContext)
  const [inputData, setInputData] = useState<any>({
    listName: name,
    description,
  })
  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: 'listName',
      placeHolder: 'List name',
      errorMsg: '',
    },
  ])
  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }

  const handleSubmit = async (e: any) => {
    if (!inputData?.listName) return //If there is no title, return
    if (inputData.listName === name && inputData.description === description) {
      setState(false)
      return
    }

    let updateQuery: any = {} //Creates an object query for supabase, only changing whats edited
    if (inputData.listName !== name) {
      updateQuery['name'] = inputData.listName
    }
    if (inputData.description !== description) {
      updateQuery['description'] = inputData.description
    }

    // Handle duplicate lists
    const { data: requestedListName } = await findList(inputData.listName)
    if (requestedListName?.length !== 0) {
      setInputs(oldInput =>
        oldInput.map(input =>
          input.id === 1
            ? { ...input, errorMsg: 'List name already taken. Pick another.' }
            : input,
        ),
      )
      return
    }

    const [status, error] = await updateList(id, updateQuery)

    if (!error) {
      switch (String(status).charAt(0)) {
        case '2': {
          setLists((oldLists: iList[]) =>
            oldLists.map(list =>
              list.id === id
                ? {
                    ...list,
                    name: inputData.listName,
                    description: inputData.description,
                  }
                : list,
            ),
          )
          setState(false)
          break
        }
        default: {
          setState(false)
          break
        }
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
          <HiQueueList className="w-8 h-8 text-text" />
        </div>
        <Text
          style="heading"
          type="h1"
          className="mb-2"
        >
          Edit my list
        </Text>
        {inputs.map(props => (
          <Input
            key={props.id}
            {...props}
            onChange={onChange}
            defaultValue={name}
          />
        ))}
        <TextArea
          placeholder="List description (Optional)"
          onChange={onChange}
          defaultValue={description}
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
