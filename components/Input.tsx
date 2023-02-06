import React, { useState } from 'react'

export default function Input(props: any) {
  const { label, onChange, name } = props
  return (
    <div>
      <label className="mt-10 font-medium text-text">{label}</label>
      <input
        name
        className="w-full p-4 mb-4 font-medium transition-all bg-gray-600 outline-none rounded-2xl text-text"
        {...props}
        onChange={e => onChange(name, e.target.value)}
      />
    </div>
  )
}
