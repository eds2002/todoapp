import Button from '@/components/Button'
import Layout from '@/components/Layout'
import Text from '@/components/Text'
import React, { useContext, useEffect, useState } from 'react'
import supabase from '@/utils/supabase'
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/router'
import { UserContext } from '@/context/UserProvider'

export default function Signup() {
  const { user, setUser } = useContext(UserContext)
  return (
    <main className="h-screen">
      <Layout className="flex items-center justify-center h-full pt-6">
        <div className="flex flex-col items-center justify-center w-full max-w-sm ">
          <div className="flex flex-col w-full">
            <Text
              style="heading"
              type="h1"
              className="text-5xl"
            >
              Sign In
            </Text>
            <Text
              type="p"
              className="text-lg mt-2 w-[30ch] font-medium opacity-50"
            >
              Welcome back, let&apos;s get you back in.
            </Text>
          </div>
          <Form />
        </div>
      </Layout>
    </main>
  )
}

function Form() {
  const { setUser } = useContext(UserContext)
  const [inputData, setInputData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState([
    {
      id: 1,
      type: 'email',
      label: 'Email',
      name: 'email',
      placeHolder: 'janedoe@gmail.com',
      required: true,
      error: false,
      errorMessage: ''
    },
    {
      id: 2,
      type: 'password',
      label: 'Password',
      name: 'password',
      placeHolder: 'Password',
      required: true,
      error: false,
      errorMessage: ''
    }
  ])
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const origin = window.location.origin
    const { code, message, userId } = await fetch(`${origin}/api/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: inputData.email,
        password: inputData.password
      })
    }).then(res => res.json())

    const codeNum = Number(code.toString().charAt(0))

    switch (codeNum) {
      case 2:
        setUser(userId)
        await router.push('/dashboard')
        setLoading(false)
        break
      case 4:
        if (message.includes('Email')) {
          setInputs(oldInputs =>
            oldInputs.map(input =>
              input.name === 'email'
                ? { ...input, errorMessage: message }
                : { ...input, errorMessage: '' }
            )
          )
        } else {
          setInputs(oldInputs =>
            oldInputs.map(input =>
              input.name === 'password'
                ? { ...input, errorMessage: message }
                : { ...input, errorMessage: '' }
            )
          )
        }
        setLoading(false)
        break
    }
  }

  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }

  return (
    <form
      onSubmit={e => handleSubmit(e)}
      className="w-full mt-6"
    >
      {inputs.map(props => (
        <Input
          key={props.id}
          {...props}
          onChange={onChange}
        />
      ))}
      <Button
        type="default"
        className="w-full mt-4"
        isLoading={loading}
      >
        Login
      </Button>
    </form>
  )
}

function Input(props: any) {
  const { label, error, onChange, name, errorMessage } = props
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="mt-10 font-medium text-text">{label}</label>
      <input
        name
        className={`p-4 rounded-2xl outline-none w-full bg-gray-600 text-text transition-all ${
          focused
            ? `${
                error
                  ? 'bg-red-500/25'
                  : 'invalid:bg-red-500/25 valid:bg-blue-500/25'
              }`
            : ''
        } 
        `}
        {...props}
        onBlur={() => setFocused(true)}
        onChange={e => onChange(name, e.target.value)}
      />
      <span className="block mt-1 mb-4 text-sm text-red-500 text-danger">
        {errorMessage}
      </span>
    </div>
  )
}
