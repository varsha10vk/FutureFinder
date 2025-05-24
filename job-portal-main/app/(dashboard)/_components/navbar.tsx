import React from 'react'
import NavbarRoutes from './navbar-routes'
import MobileSidebar from './mobile-sidebar'

const Navbar = () => {
  return (
    <div className='p-4 boder-b h-full flex items-center bg-white shadow-sm'>

      {/* Mobile routes */}
      <MobileSidebar />
      {/*Sidebar routes  */}
      <NavbarRoutes />
    </div>
  )
}

export default Navbar