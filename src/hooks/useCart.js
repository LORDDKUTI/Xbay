import { useState } from "react";
import api from "../api/api";
import { getSessionKey } from "../utils/session";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      const session_key = getSessionKey();

      const res = await api.post(`/cart/add/`, {
        product_id: productId,
        quantity,
        session_key,
      });

      return res.data;
    } catch (er) {
      const serverData = er?.response?.data;
      const message = serverData?.detail || serverData?.non_field_errors?.[0] || "Failed to add item";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
};

export default useCart;