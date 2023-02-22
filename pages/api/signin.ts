// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from '@/utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as jose from 'jose'
import { setCookie } from 'cookies-next'
import bcrypt from 'bcryptjs'

type Data = {
  code: number
  message: string
  userId?: any
}

async function findEmailRow(email: string) {
  return await supabase.from('user').select().eq('email', email)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, password } = req.body

  const { data: userData, error, status } = await findEmailRow(email)
  if (userData?.length === 0 || !userData)
    return res.status(400).json({ code: 400, message: 'Email not found.' })

  const isCorrectPass = await bcrypt.compare(password, userData[0].password)
  if (isCorrectPass) {
    await generateJWT(
      userData[0].id,
      userData[0].first_name,
      userData[0].last_name,
      userData[0].nickname,
      userData[0].email,
      req,
      res
    )

    return res.status(200).json({
      code: 200,
      message: 'SUCCESS',
      userId: {
        id: userData[0].id,
        firstName: userData[0].first_name,
        lastName: userData[0].last_name,
        nickname: userData[0].nickname,
        email: userData[0].email
      }
    })
  } else {
    return res.status(400).json({
      code: 400,
      message: 'Password is incorrect, please try again.'
    })
  }
}

async function generateJWT(
  id: number,
  firstName: string,
  lastName: string,
  nickname: string,
  email: string,
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const privateKey = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET
  )
  const alg = 'HS256'
  const token = await new jose.SignJWT({
    id,
    firstName,
    lastName,
    nickname,
    email
  })
    .setProtectedHeader({ alg })
    .sign(privateKey)

  setCookie('userID', token, { req, res, httpOnly: true })
}
