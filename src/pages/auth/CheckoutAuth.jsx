import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
const CheckoutAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      // hit your backend to check if user exists
      const res = await api.post("/auth/check-user/", { email });

      if (res.data.exists) {
        navigate("/login", { state: { email, redirect: "/checkout" } });
      } else {
        navigate("/register", { state: { email, redirect: "/checkout" } });
      }
    } catch (err) {
        console.error(err)
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        
        <h1 className="text-2xl font-semibold text-gray-900">
          Sign in for faster checkout
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="underline cursor-pointer"
          >
            Create account
          </span>
        </p>

        <input
          type="text"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
        />

        <button
          onClick={handleContinue}
          disabled={!email || loading}
          className="mt-6 w-full rounded-full bg-[#1f6cf2] py-3 font-semibold text-white"
        >
          {loading ? "Checking..." : "Continue"}
        </button>

        <div className="my-6 flex items-center gap-3 text-sm text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          or continue with
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <button className="flex-1 rounded-full border py-2">Google</button>
          <button className="flex-1 rounded-full border py-2">Apple</button>
          <button className="flex-1 rounded-full border py-2">Facebook</button>
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" defaultChecked />
          Stay signed in
        </label>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutAuth;