import { UserContext } from '@/context/UserProvider'
import { motion } from 'framer-motion'
import React, { useCallback, useContext } from 'react'
import Text from './Text'

export default function Header({
  headingName = 'Pathname'
}: {
  headingName: string
}) {
  const { user } = useContext(UserContext)

  const getFirstLetterOfFirstName = useCallback(
    () => user?.firstName.charAt(0).toUpperCase(),
    [user]
  )
  return (
    <header className="flex items-center justify-between">
      <Text
        type="h1"
        style="heading"
      >
        {headingName}
      </Text>
      <div className="flex items-center justify-center text-3xl font-semibold text-white bg-black rounded-full cursor-pointer w-14 h-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {getFirstLetterOfFirstName()}
        </motion.p>
      </div>
    </header>
  )
}
