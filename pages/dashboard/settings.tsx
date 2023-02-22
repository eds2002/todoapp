import Header from '@/components/Header'
import Input from '@/components/Input'
import Layout from '@/components/Layout'
import Text from '@/components/Text'
import { UserContext } from '@/context/UserProvider'
import supabase from '@/utils/supabase'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import bcrypt from 'bcryptjs'
import { IoCheckmark } from 'react-icons/io5'
import Success from '@/modals/Success'
import { iUser } from '@/interfaces/interface'
import Button from '@/components/Button'
import { useRouter } from 'next/router'

async function getPassword(id: number) {
  try {
    const { data, error } = await supabase
      .from('user')
      .select('password')
      .eq('id', id)
    return [data, null]
  } catch (e) {
    return [null, e]
  }
}

async function updatePassword(id: number, password: string) {
  try {
    const { data, error } = await supabase
      .from('user')
      .update({ password })
      .eq('id', id)
    return [data, null]
  } catch (e) {
    return [null, e]
  }
}

async function updateLastName(id: number, lastName: string) {
  try {
    const { data, error, status } = await supabase
      .from('user')
      .update({ last_name: lastName })
      .eq('id', id)
    return [data, null]
  } catch (e) {
    return [null, e]
  }
}

async function updateFirstName(id: number, firstName: string) {
  try {
    const { data, error, status } = await supabase
      .from('user')
      .update({ first_name: firstName })
      .eq('id', id)
    return [data, null]
  } catch (e) {
    return [null, e]
  }
}

export default function settings() {
  const router = useRouter()
  const { user, setUser } = useContext(UserContext)
  const [password, setPassword] = useState('')
  const [inputData, setInputData] = useState<any>({})
  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: 'firstName',
      label: 'First name',
      type: 'text',
      pattern: '[a-zA-Z]*',
      errorMsg: '',
      placeHolder: user?.firstName
    },
    {
      id: 2,
      label: 'Last name',
      name: 'lastName',
      type: 'text',
      pattern: '[a-zA-Z]*',
      errorMsg: '',
      placeHolder: user?.lastName
    },
    {
      id: 3,
      name: 'password',
      label: 'Change password',
      type: 'text',
      pattern: '[a-zA-Z]*',
      errorMsg: '',
      placeHolder: 'Reenter your password to change.',
      defaultValue: ''
    }
  ])
  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onChange = (name: string, val: string) => {
    setInputData({ ...inputData, [name]: val })
  }

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'password') {
        const inputedPassword = e.target.value
        const isCorrectPass = await bcrypt.compare(inputedPassword, password)
        if (isCorrectPass) {
          setPassword(e.target.value)
          setInputData((inpData: any) => ({ ...inpData, password: '' }))
          setInputs(inps =>
            inps.map(inp =>
              inp.id === 3
                ? {
                    ...inp,
                    placeholder: 'Type in your new password',
                    errorMsg: '',
                    name: 'newPassword'
                  }
                : inp
            )
          )
          e.target.value = ''
        } else {
          setInputData((inpData: any) => ({ ...inpData, password: '' }))
          setInputs(inps =>
            inps.map(inp =>
              inp.id === 3
                ? { ...inp, errorMsg: 'Passwords do not match.' }
                : inp
            )
          )
        }
      }
      if (e.target.name === 'newPassword') {
        if (password === e.target.value) {
          setInputData((inpData: any) => ({ ...inpData, password: '' }))
          setInputs(inps =>
            inps.map(inp =>
              inp.id === 3
                ? { ...inp, errorMsg: 'Do not enter the same password' }
                : inp
            )
          )
        } else {
          setInputs(inps =>
            inps.map(inp => (inp.id === 3 ? { ...inp, errorMsg: '' } : inp))
          )
          const hashedPass = bcrypt.hashSync(inputData.newPassword, 10)
          if (!user?.id) return
          const [data, error] = await updatePassword(user?.id, hashedPass)
          if (!error) {
            setInputData((inpData: any) => ({ ...inpData, newPassword: '' }))
            setOpenSuccessModal(true)
          }
        }
      }
      if (e.target.name === 'lastName') {
        if (user?.lastName === e.target.value) return
        if (!user?.id) return
        const [data, error] = await updateLastName(user?.id, e.target.value)
        if (!error) {
          const newUser = user
          newUser.lastName = e.target.value
          setUser(newUser)
        }
      }
      if (e.target.name === 'firstName') {
        if (user?.firstName === e.target.value) return
        if (!user?.id) return
        const [data, error] = await updateFirstName(user?.id, e.target.value)
        if (!error) {
          const newUser = user
          newUser.firstName = e.target.value
          setUser(newUser)
        }
      }
    }
  }

  const getUserPassword = useCallback(() => {
    const userId = user?.id
    if (!userId) return { password: '' }
    getPassword(userId).then(([data, error]) => {
      if ((data as []).length !== 0) {
        setPassword((data as queryPassword[])[0].password)
        // const isCorrectPass = await bcrypt.compare(
        //   password,
        //   userData[0].password
        // )
        // setInputs(inps =>
        //   inps.map(inp =>
        //     inp.id === 3
        //       ? { ...inp, defaultValue: (data as queryPassword[])[0].password }
        //       : inp
        //   )
        // )
      } else {
        setPassword('')
      }
    })
  }, [])

  const handleLogout = async () => {
    const origin = window.location.origin
    const { code, message } = await fetch(`${origin}/api/logout`).then(res =>
      res.json()
    )

    switch (code) {
      case 200: {
        router.push('/')
        break
      }
    }
  }

  useEffect(() => {
    getUserPassword()
  }, [])

  return (
    <>
      <div className="relative">
        <Layout className="py-6">
          <Header headingName="Settings" />
          <Text
            type="p"
            className="mt-10 text-4xl font-semibold"
          >
            Change your personal details.
          </Text>
          {inputs.map(props => (
            <Input
              key={props.id}
              {...props}
              value={inputData[props.name]}
              onChange={onChange}
              handleKeyPress={handleKeyPress}
            />
          ))}
          <Checkbox setInputs={setInputs} />
          <Button
            type="default"
            className="w-full mt-24 ml-auto md:px-12 sm:w-auto"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </Layout>
      </div>
      {openSuccessModal && (
        <Success
          setState={setOpenSuccessModal}
          headingText="Successfully changed your password"
          headingParagraph="We have successfully changed your password, remember to login using your new password."
        />
      )}
    </>
  )
}

function Checkbox({ setInputs }: { setInputs: (val: any) => void }) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (checked) {
      setInputs((inputs: any) =>
        inputs.map((input: any) =>
          input.id === 3 ? { ...input, type: 'text' } : input
        )
      )
    } else {
      setInputs((inputs: any) =>
        inputs.map((input: any) =>
          input.id === 3 ? { ...input, type: 'password' } : input
        )
      )
    }
  }, [checked])
  return (
    <div className="flex items-center gap-x-2">
      <div
        onClick={() => setChecked(!checked)}
        className={`flex items-center justify-center w-5 h-5 rounded-md ${
          checked ? 'bg-slate-900' : 'bg-slate-200'
        }`}
      >
        {checked && <IoCheckmark className="font-bold text-slate-100" />}
      </div>
      <Text
        type="p"
        style="none"
      >
        Show password
      </Text>
    </div>
  )
}

interface queryPassword {
  password: string
}
