import React from 'react'
import Button from './Button'
import Text from './Text'

export default function Card({ className }: { className?: string }) {
  return (
    <div className={`rounded-3xl  bg-gray-700 ${className}`}>
      <Text
        type="p"
        style="cardheading"
        className="text-2xl  p-5 rounded-3xl bg-gray-600 hover:bg-gray-600/50 transition cursor-pointer"
      >
        Design
      </Text>
      {[0, 1, 2, 3].map((data: any) => (
        <Todo data={data} />
      ))}
      <Button
        type="none"
        className="w-full border-t p-4 text-text font-medium border-gray-100/10"
      >
        View Collection
      </Button>
    </div>
  )
}

function Todo({ data }: { data: undefined }) {
  const hasCompleted = true
  return (
    <div className="w-full p-5 flex items-center justify-start gap-4">
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
