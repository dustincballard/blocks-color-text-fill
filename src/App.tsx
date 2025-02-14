import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GridCanvas } from './components/GridCanvas'
import { useStore } from './store'
import { NameForm } from './components/NameForm'

export default function App() {
  const setMousePosition = useStore(state => state.setMousePosition)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.div 
      className="w-screen h-screen relative bg-[#0a0a0a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <GridCanvas />
      <NameForm />
    </motion.div>
  )
}
