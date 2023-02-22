// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from '@/utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as jose from 'jose'
import { setCookie } from 'cookies-next'

type Data = {
  code: number
  message: string
  userId?: any
}

async function insertUser(
  firstName: string,
  lastName: string,
  nickname: string,
  email: string,
  password: string
) {
  return await supabase
    .from('user')
    .insert({
      first_name: firstName,
      last_name: lastName,
      nickname,
      email,
      password
    })
    .select()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { firstName, lastName, nickname, email, password } = req.body
  const {
    data: userData,
    status,
    error
  } = await insertUser(firstName, lastName, nickname, email, password)

  const codeNum = Number(status.toString().split('')[0])

  switch (codeNum) {
    case 2: {
      await generateJWT(
        userData![0].id,
        firstName,
        lastName,
        nickname,
        email,
        req,
        res
      )
      return res.json({
        code: status,
        message: 'SUCCESS',
        userId: {
          id: userData![0].id,
          firstName: userData![0].first_name,
          lastName: userData![0].last_name,
          nickname: userData![0].nickname,
          email: userData![0].email
        }
      })
    }
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
