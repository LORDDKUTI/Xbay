import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'   

const OrderItemsDetail = () => {
    const { id }= useParams()
    const [order, setOrder]= useState(null)

    useEffect(()=>{
        const fetchOrders= async()=>{
            try{
                const res= await api.get(`/orders/${id}/`)
                setOrder(res.data)
            }
            catch(err){
                console.error(err)

            }
        }
        fetchOrders()
    }, [id])

    if (!order){
        return <div>Loading order...</div>
    }

  return (
    <div>
        <h1>Order #{order.id}</h1>
        <p>Order Status: {order.status}</p>
        <p>{order.description}</p>
        <p>Total: ${order.total}</p>

        <h2>Items:</h2>
        <ul>
            {order.items.map((item)=>(
                <li key={item.id}>
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default OrderItemsDetail



 


