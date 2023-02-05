import Button from '@/components/Button'
import Layout from '@/components/Layout'
import Text from '@/components/Text'
import React, { useEffect, useState } from 'react'

export default function Signup() {
  return (
    <main className="h-screen">
      <Layout className="pt-6 h-full flex items-center justify-center">
        <div className="max-w-sm w-full  flex items-center justify-center flex-col  ">
          <div className="flex flex-col  w-full">
            <Text
              style="heading"
              type="h1"
              className="text-5xl"
            >
              Sign Up
            </Text>
            <Text
              type="p"
              className="text-lg mt-2 w-[30ch] font-medium opacity-50"
            >
              Start managing the important. Sign up today, all for free.
            </Text>
          </div>
          <Form />
        </div>
      </Layout>
    </main>
  )
}

function Form() {
  const [inputData, setInputData] = useState<any>({})
  const [inputs, setInputs] = useState([
    {
      id: 1,
      type: 'text',
      label: 'First Name',
      name: 'firstName',
      placeHolder: 'First Name',
      required: true,
      error: false,
    },
    {
      id: 2,
      type: 'text',
      label: 'Last Name',
      name: 'lastName',
      placeHolder: 'Last Name',
      required: true,
      error: false,
    },
    {
      id: 3,
      type: 'text',
      label: 'Nickname',
      name: 'nickname',
      placeHolder: 'Nickname (optional)',
      required: false,
      error: false,
    },
    {
      id: 4,
      type: 'email',
      label: 'Email',
      name: 'email',
      placeHolder: 'Email',
      required: true,
      error: false,
    },
    {
      id: 4,
      type: 'password',
      label: 'Password',
      name: 'password',
      placeHolder: 'Password',
      required: true,
      error: false,
    },
    {
      id: 5,
      type: 'password',
      label: 'Confirm Password',
      name: 'confirmPassword',
      placeHolder: 'Confirm Password',
      required: true,
      error: false,
    },
  ])
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputs.some(input => input.error)) return //If any error inputs are true, return
  }

  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }

  useEffect(() => {
    const confirmPassword = inputData?.confirmPassword
    const password = inputData?.password
    if (confirmPassword === undefined) return
    setInputs(
      inputs.map(input =>
        input.id === 5
          ? { ...input, error: password !== confirmPassword }
          : input,
      ),
    )
  }, [inputData])

  return (
    <form
      onSubmit={e => handleSubmit(e)}
      className="mt-6"
    >
      <div className="flex gap-x-6">
        {inputs.map(props => (
          <>
            {props.id <= 2 && (
              <Input
                key={props.id}
                {...props}
                onChange={onChange}
              />
            )}
          </>
        ))}
      </div>
      {inputs.map(props => (
        <>
          {props.id > 2 && (
            <Input
              key={props.id}
              {...props}
              onChange={onChange}
            />
          )}
        </>
      ))}
      <Button
        type="default"
        className="mt-4 w-full"
      >
        Create my account
      </Button>
    </form>
  )
}

function Input(props: any) {
  const { label, error, onChange, name } = props
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="font-medium mt-10 text-text">{label}</label>
      <input
        name
        className={`p-4 rounded-full outline-none w-full mb-4 bg-gray-600 text-text transition-all ${
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
    </div>
  )
}
