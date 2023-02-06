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

export default function Home({ user }: { user: iUser }) {
  const [openCreateList, setOpenCreateList] = useState(true)
  const { setUser } = useContext(UserContext)

  useEffect(() => {
    setUser(user ?? null)
  }, [user])
  return (
    <div className="relative">
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
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { userID } = getCookies(context)

  // NOTE: Include validating jwt? Middleware already includes validation.
  const publicKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
  const decoded = await jose.jwtVerify(userID!, publicKey)
  return { props: { user: decoded.payload } }
}
