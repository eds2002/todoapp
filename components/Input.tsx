import React, { useState } from 'react'

export default function Input(props: any) {
  const { label, onChange, name, errorMsg } = props
  return (
    <div className="mb-4">
      <label className="mt-10 font-medium text-text">{label}</label>
      <input
        name
        className={`w-full p-4  font-medium transition-all outline-none rounded-2xl text-text ${
          errorMsg === '' ? 'bg-gray-600' : 'bg-red-800/50'
        }`}
        {...props}
        onChange={e => onChange(name, e.target.value)}
      />
      {errorMsg !== '' && (
        <p className="text-sm text-red-400 mt-0.5">{errorMsg}</p>
      )}
    </div>
  )
}
