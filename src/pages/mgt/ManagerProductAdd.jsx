import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import { useNavigate } from 'react-router-dom'


const ManagerProductAdd = () => {
    const navigate= useNavigate()
    const [loadingUser, setLoadinguser]= useState(true)
    const [is_staff, setIs_staff]= useState(false)
    const [form, setForm]= useState({
        sku: "",
        name: "",
        description: "",
        category: "",
        price: "",
        inventory: "",
        is_active: true,
    })
    const [imageFile, setImageFile]= useState(null)
    const [msg, setMsg]= useState("")
    const [submitting, setSubmitting]= useState(false)

    useEffect(()=> {
        (async ()=>{
            try{
                const res= await api.get("/auth/user/")
                setIs_staff(Boolean(res.data.is_staff))
                if (!res.data.is_staff){
                    setMsg("Unauthorized: STAFF ONLY")
                    // setTimeout(()=> navigate("/"), 1200)
                }
            }catch(er){
                console.error(er?.response?.data)
                setMsg("Unauthorized: kindly login")
                // setTimeout(()=> (window.location.href= "/login"), 900)
            }finally{
                setLoadinguser(false)
            }
        })();
    }, [navigate])

    const handleChange= (e)=> {
        const { name, value, type, checked }= e.target;
        setForm( (s)=> ({ ...s, [name]: type=="checkbox" ? checked: value }) )
    }

    const handleFile= (e)=> {
        setImageFile(e.target.files?.[0] || null)
    }

    const handleSubmit= async(e)=> {
        e.preventDefault()
        setMsg("")
        setSubmitting(true)

        try{
            const fd= new FormData()
            fd.append("sku", form.sku)
            fd.append("name", form.name);
            fd.append("description", form.description);
            fd.append("category", form.category);
            fd.append("price", form.price);
            fd.append("inventory", form.inventory || "0")
            fd.append("is_active", form.is_active ? "true":"false")

            if (imageFile) fd.append("image", imageFile)

            const res= await api.post("/manager/products/", fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            console.log(res.status)

            setMsg("Product Created")
            setTimeout(()=> navigate("/manager/products/success"), 900)
        }catch (er){
            console.error("Create product error:", er?.response?.data || er)
            const data= er?.response?.data
            setMsg(
                data?.detail ||
                data?.non_field_errors?.[0] ||
                JSON.stringify(data) ||
                "Failed to create product"
            )
        }finally{
            setSubmitting(false)
        }
    }

     if (loadingUser) return <div>Checking permissions...</div>;
     if (!is_staff) return <div>{msg || "Unauthorized"}</div>;



  return (
    <div>
        ManagerProductAdd
        <h2 className="text-xl font-bold mb-4">Create Product (Manager)</h2>
        
        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded" />
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="w-full p-2 border rounded" />
            <input name="inventory" value={form.inventory} onChange={handleChange} placeholder="Inventory" type="number" className="w-full p-2 border rounded" />
            <label className="flex items-center gap-2">
            <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
            Active
            </label>

            <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            </div>

            <button disabled={submitting} className="bg-black text-white px-4 py-2 rounded">
            {submitting ? "..." : "Create"}
            </button>

            {msg && <p className="text-sm mt-2 text-red-600">{msg}</p>}
        </form>
    </div>
  )
}

export default ManagerProductAdd