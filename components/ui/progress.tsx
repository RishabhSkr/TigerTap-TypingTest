"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary/20 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex items-center"
    >
      <div className="w-full h-full bg-secondary/10 animate-pulse" />
    </motion.div>
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-500 ease-in-out",
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent",
        "after:via-white/25 after:to-transparent after:animate-shimmer"
      )}
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse-slow"
      />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
