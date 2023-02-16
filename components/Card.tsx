import { ListContext } from '@/context/ListProvider'
import { TodosContext } from '@/context/TodosProvider'
import { iList } from '@/interfaces/interface'
import EdtList from '@/modals/EditList'
import { slugify } from '@/utils/slugify'
import supabase from '@/utils/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import { IoBackspace, IoEllipsisHorizontal, IoPencil } from 'react-icons/io5'
import Text from './Text'

async function getTodosCount(id: number) {
  return await supabase
    .from('todo')
    .select('*', { count: 'exact', head: true })
    .eq('listId', id)
}
async function deleteList(id: number) {
  try {
    const { status, error } = await supabase.from('list').delete().eq('id', id)
    console.log(error)
    return [status, null]
  } catch (e) {
    return [null, e]
  }
}

export default function Card({
  className,
  name,
  desc,
  id,
  created_at,
  index,
}: {
  className?: string
  name: string
  desc?: string
  id: number
  created_at: string
  index: number
}) {
  const router = useRouter()
  const [openSettings, setOpenSettings] = useState(false)
  const [editList, setEditList] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as any).id === 'edit' || (e.target as any).id === 'delete')
      return
    if ((e.target as any).id === 'icon') {
      setOpenSettings(true)
    } else {
      router.push(`/dashboard/${id}`)
    }
  }

  return (
    <>
      <motion.div
        variants={itemVariant}
        initial={'hidden'}
        animate={'visible'}
        exit={'hidden'}
        custom={index}
        className={`rounded-2xl w-full  bg-gray-600 hover:bg-gray-600/50 transition relative aspect-video cursor-pointer ${className}`}
        layoutId={name + 'cardID'}
      >
        <div
          className="flex flex-col items-start justify-between h-full p-4 overflow-hidden"
          onClick={e => handleClick(e)}
        >
          <div className="flex items-center justify-between w-full ">
            <Text
              type="p"
              style="heading"
              className="flex-1 overflow-hidden text-2xl transition cursor-pointer rounded-3xl whitespace-nowrap text-ellipsis"
            >
              {name}
            </Text>
            <IoEllipsisHorizontal
              id="icon"
              className="text-xl text-white cursor-pointer "
              onClick={e => {
                e.stopPropagation()
                setOpenSettings(true)
              }}
            />
          </div>
          <Text
            type="p"
            style="none"
            className="text-sm transition cursor-pointer opacity-70 rounded-3xl"
          >
            Created {DateTime.fromISO(created_at).toFormat('DD')}
          </Text>
        </div>
        <AnimatePresence>
          {openSettings && (
            <SettingsContainer
              key="settingsContainer"
              setState={setOpenSettings}
              id={id}
              setEditList={setEditList}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {editList && (
          <EdtList
            setState={setEditList}
            id={id}
            description={desc}
            name={name}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function SettingsContainer({
  setState,
  id,
  setEditList,
}: {
  setState: (val: boolean) => void
  id: number
  setEditList: (val: boolean) => void
}) {
  const { lists, setLists } = useContext(ListContext)
  const settings = [
    {
      id: 'edit',
      name: 'Edit',
      icon: IoPencil,
      onClick: () => setEditList(true),
    },
    {
      id: 'delete',
      name: 'Delete',
      icon: IoBackspace,
      onClick: async () => {
        const [status, error] = await deleteList(id)
        if (!error) {
          console.log(status)
          const code = String(status).charAt(0)
          console.log(code)
          switch (code) {
            case '2': {
              setLists((lists: iList[]) => lists.filter(list => list.id !== id))
              setState(false)
              break
            }
            default: {
              setState(false)
              break
            }
          }
        }
      },
    },
  ]
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0, transition: { duration: 0.1 } }}
        onMouseLeave={() => setState(false)}
        className="absolute right-0 w-screen max-w-[150px] bg-slate-700 top-12  rounded-xl z-10 shadow-xl overflow-hidden divide-y divide-white/5 origin-top-right"
      >
        {settings.map(val => (
          <p
            id={val.id}
            onClick={val.onClick}
            className="flex items-center p-3 font-medium text-white cursor-pointer hover:bg-slate-600/50 gap-x-2"
          >
            {val.name}
            <val.icon className="text-tertiary" />
          </p>
        ))}
      </motion.div>
    </>
  )
}

const itemVariant = {
  hidden: { opacity: 0 },
  visible: (custom: number) => ({
    opacity: 1,
    transition: {
      delay: custom * 0.01,
    },
  }),
}
