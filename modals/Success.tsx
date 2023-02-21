import React, { useCallback, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/Text'
import { HiFaceSmile, HiPencil, HiQueueList } from 'react-icons/hi2'
import ModalHeader from '@/components/ModalHeader'

export default function Success({
  setState,
  headingText,
  headingParagraph
}: {
  setState: (val: boolean) => void
  headingText: string
  headingParagraph: string
}) {
  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-screen max-w-sm p-6 rounded-3xl bg-primary"
      >
        <ModalHeader setState={setState} />
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
          <HiFaceSmile className="w-8 h-8 text-text" />
        </div>
        <Text
          style="heading"
          type="h1"
          className="mb-2"
        >
          {headingText}
        </Text>
        <Text
          style="none"
          type="p"
          className="mb-2 opacity-70"
        >
          {headingParagraph}
        </Text>
      </motion.div>
    </motion.div>
  )
}
