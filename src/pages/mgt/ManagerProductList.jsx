import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const ManagerProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/manager/products/");
      setProducts(res.data.results || res.data);
    } catch (err) {
      console.error(err?.response?.data || err);
      setMsg("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/manager/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manager Products</h1>
        <button
          onClick={() => navigate("/manager")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {msg && <p className="text-red-500 mb-4">{msg}</p>}

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Active</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.inventory}</td>
                <td className="p-3">
                  {p.is_active ? "✅" : "❌"}
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => navigate(`/manager/products/${p.id}`)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerProductsList;