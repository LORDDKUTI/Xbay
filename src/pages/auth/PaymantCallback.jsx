import React, { useEffect, useState } from 'react'
import {useSearchParams,useNavigate} from "react-router-dom"
import api from '../../api/api'


const PaymantCallback = () => {
   const [params] = useSearchParams();
    const navigate = useNavigate();

    const reference = params.get("reference"); // from Paystack
    const [status, setStatus] = useState("loading"); // loading | success | failed
    const [message, setMessage] = useState("Verifying payment...");

    useEffect(() => {

        let attempts = 0;
        if (!reference) {
            setStatus("failed");
            setMessage("Missing payment reference.");
            return;
        }
        const verifyPayment = async () => {
                      
            try {
                
                // 🔥 Call YOUR backend (NOT Paystack directly)
                const res = await api.get(`/payments/verify/?reference=${reference}`);
                if ( res.data.status == "success") {
                    const orderId= res.data.order_id;
                    setStatus("success");
                    setMessage("Payment successful 🎉");
                    setTimeout(() => {
                        navigate(`/orders/${orderId}`)                        
                    }, 2000); return;
                    // console.log("Payment verified successfully:", res.data);
                } else if (res.data.status === "failed") {
                    setStatus("failed");
                    setMessage("Payment failed.");
                    console.log("Payment verification failed:", res.data);
                } else {
                    if (attempts >= 5) {
                        setStatus("failed");
                        setMessage("Payment verification timed out.");
                        console.log("Payment verification timed out:", res.data);
                        return;
                    } 

                    attempts++;    
                    // 🔁 retry after delay (webhook may still be processing)
                    setTimeout(verifyPayment, 3000);
                    console.log("Retrying payment verification:", res.data);
                }
            } catch (err) {
                console.error(err);
                setStatus("failed");
                setMessage("Something went wrong.");
            }
        };

        verifyPayment();
    }, [reference, navigate]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
      <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
        
        {status === "loading" && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Processing payment</h2>
            <p className="text-gray-500 mt-2">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-green-600">Success</h2>
            <p className="mt-2">{message}</p>

            <button
              onClick={() => navigate("/orders")}
              className="mt-6 px-6 py-3 rounded-full bg-black text-white"
            >
              View Orders
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
            <p className="mt-2">{message}</p>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 px-6 py-3 rounded-full bg-black text-white"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymantCallback


