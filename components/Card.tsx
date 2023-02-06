import React from 'react'
import Button from './Button'
import Text from './Text'

export default function Card({ className }: { className?: string }) {
  return (
    <div className={`rounded-3xl  bg-gray-700 ${className}`}>
      <Text
        type="p"
        style="cardheading"
        className="p-5 text-2xl transition bg-gray-600 cursor-pointer rounded-3xl hover:bg-gray-600/50"
      >
        Design
      </Text>
      {[0, 1, 2, 3].map((data: any) => (
        <Todo
          key={data}
          data={data}
        />
      ))}
      <Button
        type="none"
        className="w-full p-4 font-medium border-t text-text border-gray-100/10"
      >
        View Collection
      </Button>
    </div>
  )
}

function Todo({ data }: { data: undefined }) {
  const hasCompleted = true
  return (
    <div className="flex items-center justify-start w-full gap-4 p-5">
      <div
        className={`rounded-full  w-7 h-7 border-2 border-tertiary  ${
          hasCompleted
            ? 'bg-tertiary transition-all'
            : 'bg-transparent transition-all'
        }`}
      ></div>
      <div>
        <Text
          type="p"
          className="text-lg font-medium "
        >
          Prepare dribble shot
        </Text>
        <Text
          type="span"
          className="text-sm opacity-50"
        >
          Jan 24,2023
        </Text>
      </div>
    </div>
  )
}
