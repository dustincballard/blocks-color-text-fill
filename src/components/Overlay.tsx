import { motion } from 'framer-motion'

export const Overlay = () => {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-8">
        <motion.h1 
          className="text-4xl font-light tracking-wider text-[#4a9eff]"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 1 }}
        >
          Design C
        </motion.h1>
      </div>
    </motion.div>
  )
}
