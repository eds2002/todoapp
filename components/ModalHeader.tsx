import React from 'react'
import { IoClose } from 'react-icons/io5'

export default function ModalHeader({
  setState,
}: {
  setState: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-end w-full">
      <IoClose
        className="cursor-pointer w-7 h-7 text-text"
        onClick={() => setState(false)}
      />
    </div>
  )
}
