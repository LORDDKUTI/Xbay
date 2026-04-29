import React, {  useState } from 'react'
import {useNavigate} from "react-router-dom"
import api from '../api/api';


const AddProduct = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        sku: "",
        name: "",
        description: "",
        price: "",
        inventory: "",
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    
  //   useEffect(() => {
  //   // Optional: verify user is staff by hitting /api/auth/user/ or your user endpoint
  //   // If not staff, redirect or show an error
  //   (async () => {
  //     try {
  //       const res = await api.get("/auth/user/"); // dj-rest-auth user detail
  //       if (!res.data.is_staff) {
  //         setMsg("Unauthorized: staff only");
  //         setTimeout(() => navigate("/"), 1200);
  //       }
  //     } catch (err) {
  //       console.error(err?.response?.data)
  //       setMsg("Unauthorized");
  //       setTimeout(() => navigate("/login"), 800);
  //     }
  //   })();
  // }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    // basic validation
    if (!form.sku || !form.name || !form.price) {
      setMsg("SKU, name and price are required");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        sku: form.sku,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        inventory: parseInt(form.inventory || "0", 10),
        is_active: !!form.is_active,
      };
      await api.post("/product/add/", payload);
      setMsg("Product created");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      console.error("Create product error:", err?.response?.data || err);
      const data = err?.response?.data;
      setMsg(
        data?.detail ||
        data?.non_field_errors?.[0] ||
        JSON.stringify(data) ||
        "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded" />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="w-full p-2 border rounded" />
        <input name="inventory" value={form.inventory} onChange={handleChange} placeholder="Inventory" type="number" className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2">
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
          Active
        </label>

        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? "..." : "Create"}
        </button>

        {msg && <p className="text-sm mt-2 text-red-600">{msg}</p>}
      </form>
    </div>
  );
}

export default AddProduct










// export default function ProductCreate() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     sku: "",
//     name: "",
//     description: "",
//     price: "",
//     inventory: "",
//     is_active: true,
//   });
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

 
// }
