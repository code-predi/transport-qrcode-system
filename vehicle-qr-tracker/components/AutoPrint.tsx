'use client'

import { useEffect } from 'react'

export default function AutoPrint() {

  useEffect(() => {

    const timer = setTimeout(() => {
      window.print()

      setTimeout(() => {
        window.close()
      }, 500)

    }, 500)

    return () => clearTimeout(timer)

  }, [])

  return null
}