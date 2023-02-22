// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteCookie, setCookie, setCookies } from 'cookies-next'

type Data = {
  code: number
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    setCookie('userID', '', { req, res, maxAge: 0, path: '/' })
    res.status(200).json({ code: 200, message: 'SUCCESS' })
  } catch (e) {
    res.status(200).json({ code: 400, message: e as string })
  }
}
