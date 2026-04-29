import React from 'react'
import { useParams } from 'react-router-dom'

const OrderSuccess = () => {
    const {id}= useParams()

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-semibold">Payment Successful 🎉</h1>
      <p className="mt-4">Your order #{id} has been placed.</p>
    </div>
  )
}

export default OrderSuccess