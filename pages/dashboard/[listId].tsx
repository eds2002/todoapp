import Button from '@/components/Button'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Text from '@/components/Text'
import { Todo } from '@/components/Todo'
import { ListContext } from '@/context/ListProvider'
import { TodosContext } from '@/context/TodosProvider'
import { iList, iTodo } from '@/interfaces/interface'
import AddTodo from '@/modals/AddTodo'
import supabase from '@/utils/supabase'
import { AnimatePresence } from 'framer-motion'
import { DateTime } from 'luxon'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi2'

async function getAllTodos(id: number) {
  return await supabase.from('todo').select('*').eq('list_id', id)
}

async function getList(listId: number) {
  try {
    const { data, status, error } = await supabase
      .from('list')
      .select()
      .eq('id', listId)
    return [data, null]
  } catch (e) {
    return [null, e]
  }
}

export default function List({
  listId,
  listArr,
  todosArr
}: {
  listId: number
  listArr: iList[]
  todosArr: iTodo[]
}) {
  const { lists, setLists } = useContext(ListContext)
  const { todos, setTodos } = useContext(TodosContext)
  const [openAddTodo, setOpenAddTodo] = useState(false)
  const [sortBy, setSortBy] = useState<'Due soon' | 'Date Created'>('Due soon')

  const findCurrentListArr = useCallback(() => {
    const findArr: iList[] = lists.filter(
      (list: iList) => list.id === Number(listId)
    )
    if (findArr) {
      return findArr[0] as iList
    }
  }, [listId, lists])

  const getTodosFromContext = useCallback(() => {
    switch (sortBy) {
      case 'Due soon': {
        const currentListId = findCurrentListArr()?.id
        const isntCompletedTodos = todos
          .filter(
            (todo: iTodo) =>
              todo.list_id === currentListId && todo.is_completed === false
          )
          .sort(
            (a: iTodo, b: iTodo) =>
              DateTime.fromISO(a.due_by).valueOf() -
              DateTime.fromISO(b.due_by).valueOf()
          )
        const completedTodos = todos
          .filter(
            (todo: iTodo) =>
              todo.list_id === currentListId && todo.is_completed === true
          )
          .sort(
            (a: iTodo, b: iTodo) =>
              DateTime.fromISO(a.due_by).valueOf() -
              DateTime.fromISO(b.due_by).valueOf()
          )

        return [...isntCompletedTodos, ...completedTodos]
      }
      case 'Date Created': {
        return todos
          .filter((todo: iTodo) => todo.list_id === findCurrentListArr()?.id)
          .sort(
            (a: iTodo, b: iTodo) =>
              DateTime.fromISO(a.created_at).valueOf() -
              DateTime.fromISO(b.created_at).valueOf()
          )
      }
    }
  }, [todos, sortBy])

  useEffect(() => {
    if (
      lists.filter((list: iList) => list.id === Number(listId)).length === 0
    ) {
      setLists((lists: iList[]) => [...lists, ...listArr])
    }
    if (
      todos.filter((todo: iTodo) => todo.list_id === Number(listId)).length ===
      0
    ) {
      setTodos((todos: iTodo[]) => [...todos, ...todosArr])
    }
  }, [listId])

  return (
    <main>
      <Layout className="pt-6">
        <Header headingName="List" />
        <ListHeading findListArr={findCurrentListArr} />

        <div className="flex items-center justify-between">
          <Button
            type="default"
            className="py-2 mt-4"
            onClick={() => setOpenAddTodo(true)}
          >
            Add Todo
          </Button>
          <Filters
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className="h-full pb-24">
          {getTodosFromContext().length === 0 ? (
            <div className="p-5 mt-5 bg-slate-600 rounded-xl">
              <Text
                type="h6"
                style="cardheading"
              >
                We couldn&apos;t find any todos in this list.
              </Text>
              <Text
                type="p"
                style="text"
                className="text-opacity-70"
              >
                To start viewing your todos, start adding some.
              </Text>
            </div>
          ) : (
            <AnimatePresence>
              {getTodosFromContext().map((todo: iTodo, index: number) => (
                <Todo
                  data={todo}
                  key={todo.id}
                  className="my-4 bg-slate-700 rounded-xl "
                  index={index}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </Layout>
      <AnimatePresence>
        {openAddTodo && (
          <AddTodo
            setState={setOpenAddTodo}
            listId={findCurrentListArr()?.id as number}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

const Filters = ({
  sortBy,
  setSortBy
}: {
  sortBy: 'Due soon' | 'Date Created'
  setSortBy: (val: 'Due soon' | 'Date Created') => void
}) => (
  <div>
    <Button
      type="chip"
      className="py-2 mt-4 text-xs"
      active={sortBy === 'Due soon'}
      onClick={() => setSortBy('Due soon')}
    >
      Due soon
    </Button>
    <Button
      type="chip"
      className="py-2 mt-4 ml-2 text-xs"
      active={sortBy === 'Date Created'}
      onClick={() => setSortBy('Date Created')}
    >
      Date Created
    </Button>
  </div>
)

const ListHeading = ({
  findListArr
}: {
  findListArr: () => iList | undefined
}) => {
  const router = useRouter()
  const handleBackClick = () => {
    router.back()
  }
  return (
    <>
      <div
        className="flex items-center justify-start mt-10 cursor-pointer gap-x-3"
        onClick={handleBackClick}
      >
        <HiChevronLeft className="text-xl font-medium text-white" />
        <Text
          type="h1"
          style="heading"
          className=""
        >
          {findListArr()?.name ?? 'List name'}
        </Text>
      </div>
      {findListArr()?.description && (
        <Text
          type="p"
          style="none"
          className="mt-1 opacity-60"
        >
          {findListArr()?.description}
        </Text>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { listId } = context.params as any
  const [data, error] = await getList(listId)
  if ((data as iTodo[]).length !== 0) {
    const { data: todoData, error: todosError } = await getAllTodos(
      Number(listId)
    )
    return { props: { listId: listId, listArr: data, todosArr: todoData } }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard'
      },
      props: {}
    }
  }
}
