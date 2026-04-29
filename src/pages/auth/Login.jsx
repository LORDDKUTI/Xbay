import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthHeader } from '../../api/api'
import { getSessionKey } from '../../utils/session'


const Login = () => {
    const navigate= useNavigate()
    const [loading, setLoading]= useState(false)
    const [msg, setMsg]= useState("")
    const [form, setForm]= useState({ username: "", password: ""})

    useEffect(()=>{
      // check if logged in
      const access= localStorage.getItem("access")
      if (access){
        navigate("/")
      }
    }, [navigate])

    const mergeCart= async()=>{
      try{
        const session_key= getSessionKey()
        await api.post("/cart/merge/", { session_key })

      }catch (er){
        console.log("Merge failed:", er?.response?.data || er.message)
      }
      
    }
    const hSubmit= async(e)=>{

        e.preventDefault()
        setMsg("")
        setLoading(true)

        if (!form.username.trim() || !form.password){
              setMsg("ENTER USERNAME AND PASSWORD")
              setLoading(false)
              return;
            }

        try{
            const res= await api.post("/auth/login/", 
              { username: form.username.trim(), password: form.password }
            )                     
            setAuthHeader(res.data.access)
            localStorage.setItem("access", res.data.access)
            if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
            // if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
            setMsg("Login Success")
            await mergeCart()
            navigate("/")

        }catch(er){
            console.log(er?.response?.data)
            const serverData= er?.response?.data
            if (serverData){
              setMsg(
                serverData.detail || serverData.non_field_errors?.[0] || JSON.stringify(serverData)
              )
              

            }else{
              setMsg("failed to login")
            }
        }finally{
            setLoading(false)
        }
    }

    

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form onSubmit={hSubmit} className="bg-white p-8 rounded-lg shadow-md w-80" >
        <h2 className="text-xl font-bold mb-6 text-center"> Login </h2>
        {/* Username */}
        <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full mb-4 p-2 border rounded" required
        />

        {/* Password */}
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded" required
        />

        {/* Button */}
        <button disabled={loading} type="submit" className="w-full h-15 bg-black text-white py-2 rounded hover:bg-gray-800" >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-white"  role='status'> </div>
            ): (
              "Login"
            )}
        </button>

        <p className="text-center text-gray-500 mb-4">OR</p>
        <button type="button" onClick={() => (window.location.href = "http://127.0.0.1:8000/accounts/google/login/") }
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"  >
          Login with Google
        </button>
        {msg &&  <p >{msg}</p> }
      </form>
    </div>
    )
}

export default Login