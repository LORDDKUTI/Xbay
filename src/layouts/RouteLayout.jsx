import React from 'react'
import Nav from '../components/Nav'
import { Outlet } from 'react-router-dom'

const RouteLayout = ({ user, setUser }) => {
  return (
    <div className='min-h-screen bg-white text-black'>
      
        <Nav user={ user } setUser={ setUser } />
        <Outlet/>
      
    </div>
  )
}

export default RouteLayout
