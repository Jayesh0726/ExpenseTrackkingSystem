import React from 'react'
import SpotLight from '@/components/ui/spot-light'

function Dashboard() {
  return (
    <div className='flex relative items-center justify-center h-screen w-screen overflow-hidden'>
     <SpotLight  bgcolor={"bg-gray-50"} height={"h-32"} width={"w-32"} blur={"blur-[120px]"} left={"left-[55%]"} top={"top-[25%]"} RotateX={"rotate-45"} translateX={"translate-x-[0%]"} translateY={"translate-y-[0%]"}/>
      
    <main className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-y-32 gap-4 px-2 justify-center  py-2 grid-rows-4 h-[100vh] w-[50vw] overflow-x-hidden bg-dark'>
      <div className='h-60 col-span-1 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl'>
        Total Balance
      </div>
      <div className='h-60 col-span-1 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl'>  
        Total Expense  
      </div>
      <div className='h-60 col-span-1 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl'>Total Income</div>
      <div className='h-10 col-span-2 md:col-span-2  lg:col-span-3 flex items-center justify-start text-2xl font-bold mt-24'>Month</div>
      <div className='h-80 col-span-2 md:col-span-2 lg:row-span-2 lg:col-span-2 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl -mt-3'>Spending Trends</div>
      <div className='h-[9.5rem] col-span-2 md:col-span-2  lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl -mt-3'>Categories</div>
      <div className='h-[9.5rem] col-span-2 md:col-span-2  lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl -mt-1'>Upcoming Bills</div>
      <div className='h-72 col-span-2 md:col-span-2  lg:col-span-3 flex items-center justify-center text-2xl font-bold bg-gradient-to-b from-[#4b4b4b5e] to-[#1b1b1b69] backdrop-blur border border-black/35 rounded-xl'>Recent Transactions</div>

    </main>
    </div>
  )
}

export default Dashboard
