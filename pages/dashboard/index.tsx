import Button from '@/components/Button'
import Card from '@/components/Card'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Text from '@/components/Text'
import CreateList from '@/modals/CreateList'
import { AnimatePresence } from 'framer-motion'
import { GetServerSideProps } from 'next'
import { useContext, useEffect, useState } from 'react'
import { getCookies } from 'cookies-next'
import * as jose from 'jose'
import { iUser } from '@/interfaces/interface'
import { UserContext } from '@/context/UserProvider'
import Lists from '@/components/Lists'

export default function Home({ user }: { user: iUser }) {
  const [openCreateList, setOpenCreateList] = useState(false)
  const { user: currentUser, setUser } = useContext(UserContext)

  return (
    <div className="relative">
      <Layout className="py-6">
        <Header headingName="Dashboard" />
        <Text
          type="p"
          className="mt-10 text-4xl font-semibold"
        >
          Good morning,
          <br /> {currentUser?.firstName}
        </Text>
        <Button
          type="default"
          className="px-6 py-2 mt-10 w-max"
          onClick={() => setOpenCreateList(true)}
        >
          Create List
        </Button>
        <Lists />
      </Layout>
      <AnimatePresence>
        {openCreateList && <CreateList setState={setOpenCreateList} />}
      </AnimatePresence>
    </div>
  )
}
