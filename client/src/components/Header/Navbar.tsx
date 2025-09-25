import React from 'react'
import { useState } from "react"
import { User } from "lucide-react"

function Navbar() {
  return (
    <div>
      <nav
        className="bg-white dark:bg-gray-700 w-72 h-full fixed top-0 left-0 shadow-lg z-50 border-r-4 items-center flex flex-col justify-between"
      >
       
       <div className='flex-grow p-4'>

         {/* Add your navigation links or other content here */}
       </div>
       <div className='flex items-center justify-center h-16 border-t w-full'>
         <div className='text-gray-800 dark:text-gray-100 h-12 w-68 hover:bg-gray-500 cursor-pointer flex flex-row pr-4 gap-3 items-center text-lg font-semibold rounded-md animated ease-in duration-100'>
           <p className='h-10 w-10 flex ml-2 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-100'>
             <User className='inline' />
           </p>
           <p>Profile</p>
         </div>
       </div>
      </nav>
      
    </div>
  )
}

export default Navbar
