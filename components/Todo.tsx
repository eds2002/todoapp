import { TodosContext } from '@/context/TodosProvider'
import { iTodo } from '@/interfaces/interface'
import EditTodo from '@/modals/EditTodo'
import supabase from '@/utils/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { DateTime } from 'luxon'
import { useContext, useState } from 'react'
import { IoBackspace, IoEllipsisHorizontal, IoPencil } from 'react-icons/io5'
import Text from './Text'

async function updateTodoCompletion(id: number, isCompleted: boolean) {
  return await supabase
    .from('todo')
    .update({ is_completed: isCompleted })
    .eq('id', id)
}

async function deleteTodo(id: number) {
  try {
    const { status } = await supabase.from('todo').delete().eq('id', id)
    return [status, null]
  } catch (error) {
    return [null, error]
  }
}

export function Todo({
  data,
  className,
  index
}: {
  data: iTodo
  className: string
  index: number
}) {
  const [isCompleted, setIsCompleted] = useState(data.is_completed)
  return (
    <motion.div
      key={`${data.id}-todoLayout`}
      variants={itemVariant}
      initial={'hidden'}
      animate={'visible'}
      exit={'hidden'}
      custom={index}
      layoutId={`${data.id}-todoLayout`}
      className={`flex items-center justify-start w-full gap-4 p-5 relative ${className}`}
    >
      <Checkbox
        data={data}
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
      />
      <div className="w-full">
        <NameAndCreated
          data={data}
          isCompleted={isCompleted}
        />
        <DueBy
          data={data}
          isCompleted={isCompleted}
        />
      </div>
    </motion.div>
  )
}

function Checkbox({
  data,
  isCompleted,
  setIsCompleted
}: {
  data: iTodo
  isCompleted: boolean
  setIsCompleted: (val: boolean) => void
}) {
  const { setTodos } = useContext(TodosContext)
  const handleClick = async (id: number) => {
    const { data, error } = await updateTodoCompletion(id, !isCompleted)
    if (!error) {
      setTodos((oldTodos: iTodo[]) =>
        oldTodos.map((todo: iTodo) =>
          todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
        )
      )
      setIsCompleted(!isCompleted)
    }
  }
  return (
    <div
      className={`cursor-pointer rounded-full  w-7 h-7 border-2 border-tertiary  ${
        isCompleted
          ? 'bg-tertiary transition-all'
          : 'bg-transparent transition-all'
      }`}
      onClick={() => handleClick(data.id)}
    />
  )
}

function NameAndCreated({
  data,
  isCompleted
}: {
  data: iTodo
  isCompleted: boolean
}) {
  const [openSettings, setOpenSettings] = useState(false)
  const [editTodo, setEditTodo] = useState(false)
  return (
    <div className="relative flex items-center justify-between">
      <Text
        type="p"
        className={`text-lg font-medium ${isCompleted ? 'line-through' : ''}`}
      >
        {data.name}
      </Text>
      <div className="relative flex items-center gap-x-2">
        <Text
          type="p"
          className="text-xs opacity-50"
        >
          {`${DateTime.fromISO(data.created_at).toFormat('DD')}`}
        </Text>
        <IoEllipsisHorizontal
          className="text-xl text-white cursor-pointer"
          onClick={() => setOpenSettings(true)}
        />
        <AnimatePresence>
          {openSettings && (
            <SettingsContainer
              key="settingsContainer"
              setState={setOpenSettings}
              data={data}
              setEditTodo={setEditTodo}
            />
          )}
          {editTodo && (
            <EditTodo
              key="editTodo"
              data={data}
              setState={setEditTodo}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function DueBy({ data, isCompleted }: { data: iTodo; isCompleted: boolean }) {
  const timeTillDue = () => {
    const date1 = DateTime.fromISO(data.due_by)
    const date2 = DateTime.now()

    const diff = date1.diff(date2, ['days', 'hours', 'minutes']).toObject()

    if (date1.valueOf() < DateTime.now().valueOf()) {
      return `passed due by (${(diff?.days! * -1).toFixed(0)} days)`
    }

    if (diff.days === 0) {
      return `in (${diff.hours?.toFixed(0)} hours and ${diff.minutes?.toFixed(
        0
      )} minutes)`
    } else {
      return `in (${diff.days?.toFixed(0)} days and ${diff.hours?.toFixed(
        0
      )} hours)`
    }
  }
  return (
    <div className="flex flex-col">
      <Text
        type="span"
        className="text-sm opacity-50"
      >
        {'By '}
        {DateTime.fromISO(data.due_by).toFormat('DD')}{' '}
        {DateTime.fromISO(data.due_by).toFormat('t')}
      </Text>
      {!isCompleted ? (
        <Text
          type="span"
          className="text-xs opacity-50"
        >
          {' '}
          {`${timeTillDue()}`}
        </Text>
      ) : (
        <Text
          type="span"
          className="text-xs opacity-50"
        >
          Completed
        </Text>
      )}
    </div>
  )
}

function SettingsContainer({
  setState,
  data: todoData,
  setEditTodo
}: {
  setState: (val: boolean) => void
  data: iTodo
  setEditTodo: (val: boolean) => void
}) {
  const { todos, setTodos } = useContext(TodosContext)
  const settings = [
    {
      id: 'edit',
      name: 'Edit',
      icon: IoPencil,
      onClick: () => setEditTodo(true)
    },
    {
      id: 'delete',
      name: 'Delete',
      icon: IoBackspace,
      onClick: async () => {
        const [status, error] = await deleteTodo(todoData.id)
        if (!error) {
          const code = Number(String(status).charAt(0))
          switch (code) {
            case 2: {
              setTodos((todos: iTodo[]) =>
                todos.filter(todo => todo.id !== todoData.id)
              )
              setState(false)
              break
            }
            default: {
              setState(false)
              break
            }
          }
        }
      }
    }
  ]
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0, transition: { duration: 0.1 } }}
        onMouseLeave={() => setState(false)}
        className="absolute right-0 w-screen max-w-[150px] bg-slate-600 top-5  rounded-xl z-10 shadow-xl overflow-hidden divide-y divide-white/5 origin-top-right"
      >
        {settings.map(val => (
          <p
            key={val.id}
            onClick={val.onClick}
            className="flex items-center p-3 font-medium text-white cursor-pointer hover:bg-slate-700/50 gap-x-2"
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
      delay: custom * 0.1
    }
  })
}
