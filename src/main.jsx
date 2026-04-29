import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import api, { setAuthHeader } from './api/api.js'

const token= localStorage.getItem("access")
if (token) api.defaults.headers.common.Authorization= `Bearer ${token}`
if (token) setAuthHeader(token)

createRoot(document.getElementById('root')).render(  
    <App />,
)
