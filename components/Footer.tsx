'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <a
          href="https://buymeacoffee.com/rishabhskr" // Replace with your actual Buy Me a Coffee username
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-full bg-[#FFDD00] text-black font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
            alt="Buy me a coffee"
            className="h-6 w-6 mr-2"
          />
          Buy me a coffee
        </a>
        <div className="text-center text-xs mt-2 text-gray-600 flex items-center justify-center">
            Made with 
            ❤️ by Rishabh Sonkar
        </div>
       
      </motion.div>
    </footer>
  )
}
