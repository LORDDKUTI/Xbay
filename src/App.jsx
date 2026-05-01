import React from 'react'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import './App.css'
import RouteLayout from "./layouts/RouteLayout"
import Home from "./pages/Home"
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProductList from './pages/ProductList'
import AddProduct from './pages/AddProduct'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import DealCategoryPage from './pages/DealCategoryPage'
import ManagerProductAdd from './pages/mgt/ManagerProductAdd'
import ManagerProductSuccess from './pages/mgt/ManagerProductSuccess'
import ManagerProductsList from './pages/mgt/ManagerProductList'
import Checkout from './pages/auth/Checkout'
import CheckoutAuth from './pages/auth/CheckoutAuth'
import OrderSuccess from './pages/auth/OrderSuccess'
import PaymantCallback from './pages/auth/PaymantCallback'
import Orders from './pages/Orders'
import OrderItemsDetail from './pages/OrderItemsDetail'
import ProtctedRouteComponent from './components/ProtctedRouteComponent'
import { useState } from 'react'
import { useEffect } from 'react'
import api from './api/api'

function App() {

  const [user, setUser] = useState(null)
  useEffect(()=>{
    const token = localStorage.getItem("access")
    if (!token) return

    const loadUser = async () => {
      try{
        const res= await api.get("/auth/user/")
        setUser(res.data)
      } catch {
        setUser(null)
      }
    }
    loadUser()
  }, [])



  const router= createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={ <RouteLayout user={user} setUser={ setUser } /> }  >
        <Route index element={<ProductList/> }  />
        <Route path='login' element={<Login/> }  />
        <Route path='signup'  element={<Signup/> }  />

        <Route path='checkout' element={<Checkout/> }  />
        <Route path='checkout-auth' element={<CheckoutAuth/>}  />
        <Route path='/payment/callback' element={<PaymantCallback/> } />
        <Route path='order-success/:id' element={<OrderSuccess/> } />
        <Route path='orders/:id' element={<OrderItemsDetail/> } />
        <Route path='orders' element={<Orders/> } />

        <Route path='products' element={<ProductList/> }  />
        <Route path='products/:id' element={<ProductDetail/> }  />
        <Route path='deals/:slug' element={<DealCategoryPage/> }  />
        <Route path='cart' element={ <Cart/> } />


        <Route path='manager' element={ 
          <ProtctedRouteComponent user={user} role="manager">
             <ManagerProductAdd/> 
          </ProtctedRouteComponent> }
        />
        <Route path='create' element={ 
          <ProtctedRouteComponent user={user} role="manager">
             <AddProduct/> 
          </ProtctedRouteComponent> }
        />
        <Route path='manager/products/list' element={ 
          <ProtctedRouteComponent user={user} role="manager">
             <ManagerProductsList/> 
          </ProtctedRouteComponent> }
        />
        <Route path='manager/products/success' element={ 
          <ProtctedRouteComponent user={user} role="manager">
             <ManagerProductSuccess/> 
          </ProtctedRouteComponent> }
        />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
