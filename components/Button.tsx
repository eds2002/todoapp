import Link from 'next/link'
import React, { ReactNode } from 'react'

type types = 'chip' | 'default' | 'none'

interface ButtonProps {
  children: ReactNode
  href?: string
  className?: string
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
        <Link href={Props.href}>{Props.children}</Link>
      ) : (
        <button className={`${css} ${Props.className}`}>
          {Props.children}
        </button>
      )}
    </>
  )
}
