import React from 'react'

function Dashboard() {
  return (
    <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-4 px-24 py-4 grid-rows-4 h-[120vh] w-[100vw] overflow-x-hidden'>
      <div className='h-56 col-span-2 md:col-span-2 lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-amber-400'>
        Total Balance
      </div>
      <div className='h-56 col-span-2 md:col-span-2 lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-amber-500'>  
        Total Expense  
      </div>
      <div className='h-56 col-span-2 md:col-span-2 lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-amber-600'>Total Income</div>
      <div className='h-16 col-span-2 md:col-span-2  lg:col-span-3 flex items-center justify-center text-2xl font-bold bg-amber-300'>Month</div>
      <div className='h-60 col-span-2 md:col-span-2 lg:row-span-2 lg:col-span-2 flex items-center justify-center text-2xl font-bold bg-amber-900'>Spending Trends</div>
      <div className='h-16 col-span-2 md:col-span-2  lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-amber-300'>Categories</div>
      <div className='h-16 col-span-2 md:col-span-2  lg:col-span-1 flex items-center justify-center text-2xl font-bold bg-amber-300'>Upcoming Bills</div>
      <div className='h-80 col-span-2 md:col-span-2  lg:col-span-3 flex items-center justify-center text-2xl font-bold bg-amber-300'>Recent Transactions</div>

    </main>
  )
}

export default Dashboard
