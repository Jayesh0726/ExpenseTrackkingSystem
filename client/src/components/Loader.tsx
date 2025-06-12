import React from 'react'
import { Loader2 as LucideLoader } from 'lucide-react'
import { cn } from '../lib/utils'

function Loader() {
  return (
    <div className="flex items-center justify-center align-middle">
      <LucideLoader className={cn("h-6 w-6 mr-2 animate-spin duration-900 text-white/80")} />
        <div className="text-xl text-white/80 ">Loading... </div>
    </div>
  )
}

export default Loader
