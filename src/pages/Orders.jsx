import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'    


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/");
            setOrders(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        }
        };

        fetchOrders();
    }, []);

    if (!orders.length) {
        return <div className="p-6">No orders yet.</div>;
    }
    
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="border p-4 rounded-xl cursor-pointer hover:shadow"
          >
            <div className="flex justify-between">
              <span>Order #{order.id}</span>
              <span className="capitalize">{order.status}</span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              ₦{order.total_price}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders

