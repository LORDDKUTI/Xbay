import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkPlus, Info, ShieldCheck, Trash2 } from "lucide-react";
import api from "../api/api";
import { getSessionKey } from "../utils/session";

const CartItem = ({ item, updateQuantity, removeItem, saveForLater }) => {
  const maxQuantity = Math.max(1, Math.min(Number(item.product?.inventory || 1), 5));

  return (
    <article className="rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-start gap-4">
        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 md:h-32 md:w-28">
          <img
            src={item.product?.image}
            alt={item.product?.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="line-clamp-2 text-sm font-semibold text-gray-900 md:text-base">
                {item.product?.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                {item.product?.category || "Cart item"}
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                ${Number(item.product?.price || 0).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {item.product?.inventory > 0
                  ? `${item.product.inventory} available`
                  : "Currently unavailable"}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="rounded-xl border border-gray-200 p-2 text-gray-700 transition hover:border-black hover:text-black"
              aria-label={`Remove ${item.product?.name}`}
            >
              <Trash2 size={18} strokeWidth={2.2} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Qty</span>
              <select
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              >
                {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => saveForLater(item)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-black"
              >
                <BookmarkPlus size={16} />
                Save for later
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const SavedItemCard = ({ item, moveToCart }) => (
  <article className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex gap-4">
      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={item.product?.image}
          alt={item.product?.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold text-gray-900">
          {item.product?.name}
        </p>
        <p className="mt-2 text-base font-semibold text-gray-900">
          ${Number(item.product?.price || 0).toFixed(2)}
        </p>
        <button
          onClick={() => moveToCart(item)}
          className="mt-3 rounded-full border border-[#1f6cf2] px-4 py-2 text-sm font-semibold text-[#1f6cf2] transition hover:bg-blue-50"
        >
          Move back to cart
        </button>
      </div>
    </div>
  </article>
);

const DesktopSummary = ({ user, itemCount, shippingFee, total, navigate }) => (
  <div className="hidden md:block">
    <div className="sticky top-24 rounded-3xl bg-[#f5f4f1] p-8 shadow-sm">
      <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Order summary</h2>

      <div className="mt-10 space-y-6 text-lg text-gray-900">
        <div className="flex justify-between gap-4">
          <span>Items ({itemCount})</span>
          <span>US ${total}</span>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Shipping to 900211</span>
            <Info size={18} className="text-gray-500" />
          </div>
          <span>{shippingFee === 0 ? "Free" : `US $${shippingFee.toFixed(2)}`}</span>
        </div>
      </div>

      <div className="my-8 border-t border-gray-300" />

      <div className="flex justify-between text-2xl font-semibold text-gray-900">
        <span>Subtotal</span>
        <span>US ${total}</span>
      </div>

      <button
        onClick={() => {
          if (!user){
            navigate("/checkout-auth");
          }else{
            navigate("/checkout")
          }
        }}
        className="mt-8 w-full rounded-full bg-[#1f6cf2] px-5 py-4 text-lg font-semibold text-white transition hover:bg-[#1455c5]"
      >
        Go to checkout
      </button>

      <div className="mt-8 flex items-start gap-3 text-base text-gray-900">
        <ShieldCheck className="mt-0.5 text-[#1f6cf2]" size={22} />
        <p>
          Purchase protected by{" "}
          <span className="text-[#1f6cf2] underline">Money Back Guarantee</span>
        </p>
      </div>
    </div>
  </div>
);

const MobileSummaryBar = ({ user, itemCount, total, navigate }) => (
  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur md:hidden">
    <div className="mx-auto max-w-7xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Subtotal</p>
          <p className="text-2xl font-semibold text-gray-900">US ${total}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Items</p>
          <p className="text-lg font-semibold text-gray-900">{itemCount}</p>
        </div>
      </div>

      <button
        onClick={() =>{
          if(!user){
            navigate("/checkout")
          }else{
            navigate("/checkout")
          }
        }
        }
        className="w-full rounded-full bg-[#1f6cf2] px-5 py-3.5 text-base font-semibold text-white transition hover:bg-[#1455c5]"
      >
        Go to checkout
      </button>
    </div>
  </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [user, setUser] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setErr(null);

    try {
      const session_key = getSessionKey();
      const res = await api.get(`/cart/?session_key=${session_key}`);

      setItems(res.data.results || res.data || []);

      try {
        const userRes = await api.get("/auth/user/");
        setUser(userRes?.data || null);
      } catch {
        setUser(null);
      }
    } catch (er) {
      console.log(er);
      const userData = er?.response?.data;
      setErr(
        userData?.detail ||
          userData?.non_field_errors?.[0] ||
          "Failed to load cart items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      const session_key = getSessionKey();
      const res = await api.put(`/cart/${itemId}/?session_key=${session_key}`, { quantity });
      if (res.status === 200) {
        fetchCart();
      }
    } catch (er) {
      console.log("CART RES:", er?.response?.data || er);
      setErr("Failed to update item quantity.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const session_key = getSessionKey();
      const res = await api.delete(`/cart/${itemId}/delete/?session_key=${session_key}`);
      if (res.status === 204) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (er) {
      console.log(er);
      setErr("Failed to remove item.");
    }
  };

  const saveForLater = (item) => {
    setSavedItems((prev) => {
      if (prev.some((saved) => saved.id === item.id)) return prev;
      return [...prev, item];
    });
    setItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
  };

  const moveToCart = (item) => {
    setSavedItems((prev) => prev.filter((saved) => saved.id !== item.id));
    setItems((prev) => [...prev, item]);
  };

  const total = useMemo(
    () =>
      items
        .reduce((sum, item) => sum + item.quantity * Number(item.product?.price || 0), 0)
        .toFixed(2),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items]
  );

  const shippingFee = 0;

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-32 md:pb-10">
      <div className="border-b border-gray-200 bg-white px-6 py-4 text-sm font-medium text-gray-700">
        account / cart / {user?.username || "anonymous"}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-900">Your cart is empty.</p>
            <p className="mt-2 text-sm text-gray-500">
              Add a few products and they&apos;ll show up here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Your cart
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Review your items, save some for later, and check out when you&apos;re ready.
                </p>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    saveForLater={saveForLater}
                  />
                ))}
              </div>

              {savedItems.length > 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Saved for later</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Keep these close without adding them to checkout yet.
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {savedItems.length}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {savedItems.map((item) => (
                      <SavedItemCard key={item.id} item={item} moveToCart={moveToCart} />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <DesktopSummary
              items={items}
              itemCount={itemCount}
              shippingFee={shippingFee}
              total={total}
              navigate={navigate}
            />
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <MobileSummaryBar itemCount={itemCount} total={total} navigate={navigate} />
      ) : null}
    </div>
  );
};

export default Cart;
