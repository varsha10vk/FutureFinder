import React from 'react'
import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'

function DashBoardLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='h-full'>
        {/* Header */}
           <header className='h-20 md:pl-56 fixed insert-y-0 w-full z-50'>
            <Navbar />
            </header> 
        {/* sidebar */}
        <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
            <Sidebar />
        </div>

        <main className='md:pl-56 pt-20'>
            {children}
        </main>
    </div>
  )
}

export default DashBoardLayout