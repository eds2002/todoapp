import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const userToken = request.cookies.get('userID')
    if (!userToken?.value)
      return NextResponse.redirect(new URL('/signup', request.url))
    const publicKey = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET,
    )
    try {
      const decoded = await jose.jwtVerify(userToken.value, publicKey)
      if (!decoded) return NextResponse.redirect(new URL('/', request.url))
    } catch (e) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/signup')) {
    const userToken = request.cookies.get('userID')
    if (userToken) {
      const publicKey = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET,
      )
      try {
        const decoded = await jose.jwtVerify(userToken.value, publicKey)
        if (decoded)
          return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (e) {
        console.log(e)
      }
    }
  }

  if (request.nextUrl.pathname.startsWith('/signin')) {
    const userToken = request.cookies.get('userID')
    if (userToken) {
      const publicKey = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET,
      )
      try {
        const decoded = await jose.jwtVerify(userToken.value, publicKey)
        if (decoded)
          return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (e) {
        console.log(e)
      }
    }
  }
}
