import { ListContext } from '@/context/ListProvider'
import { iList } from '@/interfaces/interface'
import { AnimatePresence } from 'framer-motion'
import React, { useContext } from 'react'
import Card from './Card'
import Text from './Text'

export default function Lists() {
  const { lists } = useContext(ListContext)
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
      <AnimatePresence>
        {lists.length === 0 ? (
          <div className="col-span-2 p-5 mt-5 bg-slate-600 rounded-xl md:col-span-3 lg:col-span-4">
            <Text
              type="h6"
              style="cardheading"
            >
              We couldn&apos;t find any lists.
            </Text>
            <Text
              type="p"
              style="text"
              className="text-opacity-70"
            >
              In order to start adding todos, create a list.
            </Text>
          </div>
        ) : (
          <>
            {lists.map((list: iList, index: number) => (
              <Card
                key={list.id}
                name={list.name}
                desc={list.description}
                created_at={list.created_at}
                id={list.id}
                index={index}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
