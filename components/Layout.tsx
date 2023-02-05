import React, { ReactNode } from 'react'

export default function Layout({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`max-w-7xl px-6 mx-auto w-full ${className}`}>
      {children}
    </div>
  )
}
