import React from 'react'

const CartWidget = ({items}) => {
    const count= items.reduce((s, it) => s + (it.quantity || 0), 0)
    const subtotal= items..reduce((s, it)=> s + (it.quantity * parseFloat(it.product.price || 0)),0).toFixed(2);
    
  return (
    <div>CartWidget</div>
  )
}

export default CartWidget