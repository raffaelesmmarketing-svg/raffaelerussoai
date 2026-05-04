'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const words = ['imprenditori', 'commercialisti', 'avvocati', 'architetti', 'artigiani']

export default function AnimatedHeadline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % words.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-flex items-center">
      <AnimatePresence mode="wait">
        <motion.em
          key={words[index]}
          className="em-lime"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          {words[index]}
        </motion.em>
      </AnimatePresence>
    </span>
  )
}