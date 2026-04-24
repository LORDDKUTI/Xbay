import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

const Signup = () => {
    const [msg, setMsg]= useState("")
    const [loading, setLoading]= useState(false)
    const [form, setForm]= useState({ username: "", email:"", password1: "", password2: ""})
    const navigate= useNavigate()

    const hSubmit= async(e)=>{
        e.preventDefault()
        setMsg("")
        setLoading(true)

        if (!form.username.trim() || !form.password1){
          setMsg("ENTER USERNAME AND PASSWORD")
          setLoading(false)
          return;
          }

        if (form.password1 != form.password2){
          setMsg("PASSWORDs DO NOT MATCH")
          setLoading(false)
          return;
        }

        try{
            const res= await api.post("/auth/registration/",
                { username: form.username, 
                  email: form.email, 
                  password1: form.password1,
                  password2: form.password2,
                }
            )
            setMsg("Signup Success") 
            console.log(res.status)
            setInterval(() => {
                navigate("/login")
            }, 700);
        }catch(er){
            setMsg(
                er?.response?.data 
                    ? JSON.stringify(er.response.data) 
                    : "Failed"
            )
        }finally{
          setLoading(false)
        }
    }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form onSubmit={hSubmit} className="bg-white p-8 rounded-lg shadow-md w-80" >
        <h2 className="text-xl font-bold mb-6 text-center"> Signup </h2>
        {/* Username */}
        <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value })} 
         className="w-full mb-4 p-2 border rounded" required
        />

        {/* Password */}
        <input type="password" placeholder="Password" value={form.password1} onChange={(e) => setForm({ ...form, password1: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input type="password" placeholder="Confirm Password" value={form.password2} onChange={(e) => setForm({ ...form, password2: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Button */}
        <button disabled={loading} type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800" >
            {loading ? "..." : "Signup"}
        </button>

        {msg &&  <p >{msg}</p> }
      </form>

    </div>
  )
}

export default Signup