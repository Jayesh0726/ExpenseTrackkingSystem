import React from 'react'
import { Loader2 as LucideLoader } from 'lucide-react'
import { cn } from '../lib/utils'
import MoneyGif from '../assets/Money.gif'

function Loader() {
  return (
    <div className="flex items-center justify-center flex-col align-middle fixed top-0 left-0 w-screen h-screen bg-[#13131398] z-50 gap-4">
      <img src={MoneyGif} alt="Loading..." className='w-40 h-40 object-cover' />
        <div className="text-xl text-gray-100 ">Loading... </div>
    </div>
  )
}

export default Loader
