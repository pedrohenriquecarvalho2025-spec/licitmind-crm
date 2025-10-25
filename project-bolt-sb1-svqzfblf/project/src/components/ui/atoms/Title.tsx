import React from 'react'

interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

const styles: Record<number, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-bold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-semibold',
  6: 'text-base font-semibold'
}

export function Title({ level = 2, children, className = '' }: TitleProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <Tag className={`text-neutral-800 dark:text-neutral-100 ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}

