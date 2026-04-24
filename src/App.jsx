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

function App() {
  const router= createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RouteLayout/> }  >
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


        <Route path='create' element={<AddProduct/> }  />
        <Route path='manager' element={<ManagerProductAdd/> } />
        <Route path='manager/products/success' element={<ManagerProductSuccess/> } />
        <Route path='manager/products/list' element={<ManagerProductsList/> } />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
