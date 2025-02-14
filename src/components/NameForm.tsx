import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export const NameForm = () => {
  const [name, setName] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const setUserName = useStore(state => state.setUserName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      console.log('Submitting name:', name.trim())
      setUserName(name.trim())
      setIsCollapsed(true)
    }
  }

  return (
    <AnimatePresence>
      {!isCollapsed ? (
        <motion.div 
          className="absolute bottom-1/3 right-8 z-10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <form 
            onSubmit={handleSubmit}
            className="bg-black/30 backdrop-blur-md p-8 rounded-lg border border-white/10"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              className="bg-black/50 text-white border border-white/20 rounded px-4 py-2 outline-none focus:border-[#4a9eff] transition-colors w-64"
            />
            <motion.button
              type="submit"
              className="ml-4 px-6 py-2 bg-[#4a9eff] text-white rounded hover:bg-[#3a8eff] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!name.trim()}
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsCollapsed(false)}
          className="absolute bottom-1/3 right-8 z-10 bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white hover:bg-black/40 transition-colors"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
