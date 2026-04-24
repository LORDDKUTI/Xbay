import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import {getSessionKey} from "../../utils/session"


const Checkout = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    provider: ""
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = useMemo(
    () =>
      cartItems
        .reduce((sum, item) => sum + item.quantity * Number(item.product?.price || 0), 0)
        .toFixed(2),
    [cartItems]
  );

  useEffect(()=>{
    const fetchCart= async()=>{

        try{
          const session_key= getSessionKey()
          const res= await api.get(`/cart/?session_key=${session_key}`)
          setCartItems(res.data.results || res.data || [])
        }catch (er){
          console.log(er)
        }
    }
    fetchCart()
  }, [])

  const placeOrder = async () => {
    if(cartItems.length ==0){
      setError("Cart is Empty")
      return
    }
    setLoading(true);
    setError(null);

    try {
      const session_key = getSessionKey();

      const payload = {
        session_key,
        line1: form.address,
        city: form.city,
        country: form.country,
        postal_code: form.postal_code,
        email: form.email,
        provider: form.provider || "paystack",



        // ...form,
        // items: cartItems.map((item) => ({
        //   product_id: item.product.id,
        //   quantity: item.quantity,
        //   session_key
        // })),
      };

      const res = await api.post(`/checkout/`, payload);

      if (res.status === 201) {
        const payment_url= res.data.payment_url
        if(!payment_url){
          setError("Failed to get payment URL.")
          return
        }
        // navigate(`/order-success/${res.data.payment_url}`);
        window.location.href= payment_url;
      }
    } catch (err) {
      console.log(err);
      setError("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] px-4 py-8 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_400px]">
        
        {/* LEFT: FORM */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">Checkout</h1>

          <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Shipping details</h2>

            <input name="name" placeholder="Full name" onChange={handleChange} className="input" />
            <input name="email" placeholder="Email" onChange={handleChange} className="input" />
            <input name="address" placeholder="Address" onChange={handleChange} className="input" />
            <input name="city" placeholder="City" onChange={handleChange} className="input" />
            <input name="postal_code" placeholder="Postal code" onChange={handleChange} className="input" />
            <input name="country" placeholder="Country" onChange={handleChange} className="input" />
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="sticky top-24 h-fit rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Order summary</h2>

          <div className="mt-4 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${item.product.price}</span>
              </div>
            ))}
          </div>

          <div className="my-6 border-t" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading || !form.name ||  !form.email || !form.address}
            className="mt-6 w-full rounded-full bg-[#1f6cf2] py-3 text-white font-semibold"
          >
            {loading ? "Processing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;