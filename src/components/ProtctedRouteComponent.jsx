import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtctedRouteComponent = ({ user, role, children }) => {
    if (!user){
        return <Navigate to="/login" replace />
    }

    if (role && user.role !== role){
        return <Navigate to="/login" replace />
    }


  return (
    children
  )
}

export default ProtctedRouteComponent