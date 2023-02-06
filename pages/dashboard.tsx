import Button from '@/components/Button'
import Card from '@/components/Card'
import Header from '@/components/Header'
import Input from '@/components/Input'
import Layout from '@/components/Layout'
import Text from '@/components/Text'
import TextArea from '@/components/TextArea'
import CreateList from '@/modals/CreateList'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { HiQueueList } from 'react-icons/hi2'

export default function Home() {
  const [openCreateList, setOpenCreateList] = useState(true)
  return (
    <>
      <Layout className="py-6">
        <Header />
        <Text
          type="p"
          className="mt-10 text-4xl font-semibold"
        >
          Good morning,
          <br /> Eduardo.
        </Text>
        <Button
          type="default"
          className="px-6 py-2 mt-10 w-max"
          onClick={() => setOpenCreateList(true)}
        >
          Create List
        </Button>
        <Card className="mt-2" />
        <Card className="mt-10" />
      </Layout>
      <AnimatePresence>
        {openCreateList && <CreateList setState={setOpenCreateList} />}
      </AnimatePresence>
    </>
  )
}
