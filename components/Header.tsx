import React from 'react'
import Text from './Text'

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <Text
        type="h1"
        style="heading"
      >
        Pathname
      </Text>
      <div className="w-14 h-14 rounded-full bg-black" />
    </header>
  )
}
