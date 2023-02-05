import React, { ClassAttributes, HTMLAttributes } from 'react'

type TextTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
type styles = 'cardheading' | 'heading' | 'text' | 'small' | 'none'

export default function Text({
  type,
  children,
  style = 'none',
  className,
}: {
  type: TextTypes
  children: React.ReactNode
  style?: styles | undefined
  className?: string
}) {
  let css = ''
  switch (style) {
    case 'cardheading':
      css = 'font-semibold text-lg text-text'
      break
    case 'heading':
      css = 'font-semibold text-3xl text-text'
      break
    case 'text':
      css = 'text-base text-text'
      break
    case 'none':
      css = ''
      break
  }
  switch (type) {
    case 'h1':
      return <h1 className={`${css} ${className} text-text`}>{children}</h1>
    case 'h2':
      return <h2 className={`${css} ${className} text-text`}>{children}</h2>
    case 'h3':
      return <h3 className={`${css} ${className} text-text`}>{children}</h3>
    case 'h4':
      return <h4 className={`${css} ${className} text-text`}>{children}</h4>
    case 'h5':
      return <h5 className={`${css} ${className} text-text`}>{children}</h5>
    case 'h6':
      return <h6 className={`${css} ${className} text-text`}>{children}</h6>
    case 'p':
      return <p className={`${css} ${className} text-text`}>{children}</p>
    case 'span':
      return <span className={`${css} ${className} text-text`}>{children}</span>
  }
}
