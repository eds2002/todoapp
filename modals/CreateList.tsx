import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/Text'
import { HiQueueList } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ModalHeader from '@/components/ModalHeader'

export default function CreateList({
  setState,
}: {
  setState: (val: boolean) => void
}) {
  const [inputData, setInputData] = useState<any>({})
  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }
  const inputs = [
    {
      id: 1,
      name: 'listName',
      placeHolder: 'List name',
    },
  ]

  const handleSubmit = () => {
    if (!inputData?.listName) return //If there is no title, return
    const listName = inputData.listName
    const listDesc = inputData.description
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="w-screen max-w-sm p-6 rounded-3xl bg-primary">
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
          placeholder="List description (Optional)"
          onChange={onChange}
        />
        <Button
          type="default"
          className="w-full"
          onClick={() => handleSubmit()}
        >
          Create list
        </Button>
      </motion.div>
    </motion.div>
  )
}
