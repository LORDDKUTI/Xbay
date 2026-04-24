import React from 'react'
import Nav from '../components/Nav'
import { Outlet } from 'react-router-dom'

const RouteLayout = () => {
  return (
    <div className='min-h-screen bg-white text-black'>
      <div>
        <Nav />
      </div>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default RouteLayout
