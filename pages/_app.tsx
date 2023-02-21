import ListProvider from '@/context/ListProvider'
import TodosProvider from '@/context/TodosProvider'
import UserProvider from '@/context/UserProvider'
import '@/styles/globals.css'
import { getCookie, getCookies } from 'cookies-next'
import type { AppProps } from 'next/app'
import * as jose from 'jose'
import { iUser } from '@/interfaces/interface'

interface App extends AppProps {
  data: iUser
}
export default function App({ Component, pageProps, data }: App) {
  return (
    <TodosProvider>
      <UserProvider userDecoded={data}>
        <ListProvider>
          <Component {...pageProps} />
        </ListProvider>
      </UserProvider>
    </TodosProvider>
  )
}

App.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userID } = getCookies(ctx)
  const publicKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
  if (userID) {
    const decoded = await jose.jwtVerify(userID!, publicKey)
    return { data: decoded.payload }
  } else {
    return { data: {} }
  }
}
