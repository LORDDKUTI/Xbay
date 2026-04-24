import React from "react";
import { useNavigate } from "react-router-dom";

const ManagerProductSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        
        {/* Icon */}
        <div className="text-green-500 text-5xl mb-4">
          ✔
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">
          Product Created 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your product has been successfully added to the store.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/manager/products")}
            className="bg-black text-white py-2 rounded hover:opacity-90"
          >
            View Products
          </button>

          <button
            onClick={() => navigate("/manager/products/add")}
            className="border py-2 rounded hover:bg-gray-100"
          >
            Add Another Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerProductSuccess;