import Link from 'next/link'
import React, { ReactNode } from 'react'
import { VscLoading } from 'react-icons/vsc'

type types = 'chip' | 'default' | 'none'

interface ButtonProps {
  children: ReactNode
  href?: string
  className?: string
  onClick?: (val: any) => void
  isLoading?: boolean
}

interface ButtonPropsWithActive extends ButtonProps {
  type: 'chip'
  active: boolean
}

interface ButtonPropsWithoutActive extends ButtonProps {
  type: types
  active?: boolean
}

type Props = ButtonPropsWithActive | ButtonPropsWithoutActive

export default function Button(Props: Props) {
  let css
  switch (Props.type) {
    case 'default':
      css = 'rounded-full bg-secondary text-text p-4'
      break
    case 'chip':
      css = `${
        Props.active
          ? 'bg-tertiary text-text rounded-full px-4 py-2 font-medium '
          : 'bg-tertiary/10 text-text rounded-full px-4 py-2 font-medium border border-tertiary/20'
      }`
      break
    case 'none':
      css = ''
      break
  }
  return (
    <>
      {Props.href ? (
        <Link
          href={Props.href}
          className={`${css} ${Props.className}`}
        >
          {Props.children}
        </Link>
      ) : (
        <button
          onClick={Props.onClick}
          className={`${css} ${Props.className} flex items-center justify-center`}
        >
          {Props.isLoading ? (
            <>
              <VscLoading className="w-6 h-6 animate-spin" />
            </>
          ) : (
            <>{Props.children}</>
          )}
        </button>
      )}
    </>
  )
}
