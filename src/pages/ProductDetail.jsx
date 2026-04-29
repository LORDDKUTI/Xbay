import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  ChevronDown,
  Heart,
  Info,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import api from "../api/api";
import SearchBar from "../components/SearchBar";
import useCart from "../hooks/useCart";

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-gray-100 py-3 text-sm last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const RelatedItemCard = ({ product }) => (
  <Link
    to={`/products/${product.id}`}
    className="group rounded-3xl border border-gray-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="relative overflow-hidden rounded-[1.2rem] bg-gray-100">
      <button
        type="button"
        onClick={(event) => event.preventDefault()}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-gray-700 shadow-sm"
        aria-label={`Save ${product.name}`}
      >
        <Heart size={16} />
      </button>

      <img
        src={product.image}
        alt={product.name}
        className="h-44 w-full object-cover transition group-hover:scale-105"
      />
    </div>

    <div className="mt-3 space-y-1">
      <p className="line-clamp-2 text-sm font-medium text-gray-900">{product.name}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
        {product.category || "Featured"}
      </p>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-lg font-semibold text-gray-900">
          ${Number(product.price).toFixed(2)}
        </span>
        <span className="text-xs text-gray-400 line-through">
          ${(Number(product.price) * 1.18).toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-gray-500">
        {product.inventory > 0 ? `${product.inventory} left in stock` : "Currently unavailable"}
      </p>
    </div>
  </Link>
);

const GuestCheckoutPrompt = ({ product, onClose, onSignIn, onGuestCheckout }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-24 overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="line-clamp-3 text-sm font-medium leading-6 text-gray-900">
              {product.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          aria-label="Close guest checkout prompt"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onSignIn}
          className="w-full rounded-full bg-[#1f6cf2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1455c5]"
        >
          Sign In to check out
        </button>

        <button
          type="button"
          onClick={onGuestCheckout}
          className="w-full rounded-full border border-[#1f6cf2] px-5 py-3 text-sm font-semibold text-[#1f6cf2] transition hover:bg-blue-50"
        >
          Check out as guest
        </button>
      </div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: adding, error: addError } = useCart();
  const [product, setProduct] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await api.get(`/products/${id}/`);
        if (mounted) {
          setProduct(res.data);
        }
      } catch (er) {
        if (mounted) {
          setErr(er.response?.data?.error || er.message || "Failed to fetch product");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return undefined;

    let mounted = true;

    const fetchSimilarItems = async () => {
      try {
        const categoryRes = await api.get("/products/", {
          params: {
            page_size: 8,
            category: product.category,
            ordering: "-created_at",
          },
        });

        let items = categoryRes.data.results || categoryRes.data || [];
        items = items.filter((item) => item.id !== product.id);

        if (items.length === 0) {
          const fallbackRes = await api.get("/products/", {
            params: {
              page_size: 8,
              search: product.category || product.name,
            },
          });
          items = (fallbackRes.data.results || fallbackRes.data || []).filter(
            (item) => item.id !== product.id
          );
        }

        if (mounted) {
          setSimilarItems(items.slice(0, 4));
        }
      } catch (fetchError) {
        if (mounted) {
          setSimilarItems([]);
        }else{
          console.error(fetchError)
        }
      }
    };

    fetchSimilarItems();

    return () => {
      mounted = false;
    };
  }, [product]);

  const pricing = useMemo(() => {
    if (!product) return null;

    const currentPrice = Number(product.price || 0);
    const listPrice = currentPrice * 1.35;
    const savingsPercent = listPrice
      ? Math.round(((listPrice - currentPrice) / listPrice) * 100)
      : 0;

    return {
      currentPrice,
      listPrice,
      savingsPercent,
    };
  }, [product]);

  const shoppingMeta = useMemo(() => {
    if (!product) return null;

    const stock = Number(product.inventory || 0);
    const soldCount = Math.max(132, stock * 17 + 43);
    const watchingCount = Math.max(58, stock * 9 + 24);
    const shippingFee = pricing?.currentPrice > 150 ? 0 : 12.99;

    return {
      soldCount,
      watchingCount,
      shippingFee,
      estimatedDelivery: "Estimated between Tue, Apr 22 and Fri, Apr 25",
      returnWindow: "30-day returns with quick refund processing",
      condition: stock > 0 ? "Brand New" : "Currently unavailable",
    };
  }, [product, pricing]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  const handleBuyNow = async () => {
    const isGuest = !localStorage.getItem("access");

    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }

    try {
      await addToCart(product.id, quantity);
      navigate("/cart");
    } catch (error) {
      console.error("Buy now failed", error);
      navigate("/cart");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (err) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Error: {typeof err === "string" ? err : JSON.stringify(err)}
        </p>
        <Link to="/products" className="text-blue-600">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <p>Product not found</p>
        <Link to="/products" className="text-blue-600">
          Back to products
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    image,
    category,
    sku,
    inventory,
    brand,
  } = product;

  const availableQuantity = Math.max(1, Math.min(Number(inventory || 1), 5));

  return (
    <div className="bg-[#faf9f7]">
      {showGuestPrompt ? (
        <GuestCheckoutPrompt
          product={product}
          onClose={() => setShowGuestPrompt(false)}
          onSignIn={() => navigate("/login")}
          onGuestCheckout={async () => {
            setShowGuestPrompt(false);
            try {
              await addToCart(product.id, quantity);
            } catch (error) {
              console.error("Guest checkout failed", error);
            } finally {
              navigate("/cart");
            }
          }}
        />
      ) : null}

      <SearchBar />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Link to="/products" className="text-sm font-medium text-blue-600">
          Back to listings
        </Link>

        <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_420px]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[90px_1fr]">
                <div className="hidden border-r border-gray-100 bg-[#fcfbf9] p-4 lg:flex lg:flex-col lg:gap-3">
                  {[image, image, image].map((thumb, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      <img
                        src={thumb}
                        alt={`${name} thumbnail ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-4 md:p-6">
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-gray-100">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="h-105 w-full object-cover md:h-140"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="flex h-105 items-center justify-center text-gray-500 md:h-140">
                        No Image
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-700 shadow-sm">
                        {category || "Featured"}
                      </span>
                      <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                        {shoppingMeta.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                    About this item
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                    Item specifics
                  </h2>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Seller assumes all responsibility for this listing.</p>
                  <p className="mt-1">Item number: {sku || "Pending"}</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <p className="leading-7 text-gray-700">
                    {description || "No description provided."}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#fcfbf9] p-5">
                  <InfoRow label="Condition" value={shoppingMeta.condition} />
                  <InfoRow label="Brand" value={brand || category || "YourStore"} />
                  <InfoRow label="Category" value={category || "General"} />
                  <InfoRow label="SKU" value={sku || "Not provided"} />
                  <InfoRow
                    label="Inventory"
                    value={
                      typeof inventory === "number"
                        ? `${inventory} available`
                        : "Availability updates at checkout"
                    }
                  />
                  <InfoRow label="Delivery" value={shoppingMeta.estimatedDelivery} />
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Similar items</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    More options shoppers usually compare before checkout
                  </p>
                </div>
                <Link to="/products" className="text-sm font-medium text-blue-600">
                  See all
                </Link>
              </div>

              {similarItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {similarItems.map((item) => (
                    <RelatedItemCard key={item.id} product={item} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Similar items will appear here as soon as more matching products are available.
                </p>
              )}
            </div>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                    {category || "Featured pick"}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-gray-900">
                    {name}
                  </h1>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-gray-200 p-2 text-gray-600 transition hover:border-black hover:text-black"
                  aria-label={`Save ${name}`}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="mt-5">
                <div className="text-4xl font-bold text-gray-900">
                  ${pricing.currentPrice.toFixed(2)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span className="line-through">${pricing.listPrice.toFixed(2)}</span>
                  <span>({pricing.savingsPercent}% off)</span>
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <Info size={14} />
                    Price details
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-4 rounded-2xl bg-[#f8f8f8] p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 text-gray-700" size={18} />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      This one&apos;s trending.
                    </span>{" "}
                    {shoppingMeta.soldCount} shoppers already bought it recently.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="mt-0.5 text-gray-700" size={18} />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">People want this.</span>{" "}
                    {shoppingMeta.watchingCount} shoppers are watching it now.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm"
                  >
                    <span>Select available option</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
                    >
                      {Array.from({ length: availableQuantity }, (_, index) => index + 1).map(
                        (value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="rounded-xl bg-[#fff8e7] px-4 py-3 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">
                      {inventory > 0 ? `${inventory} units ready to ship` : "Currently out of stock"}
                    </p>
                    <p className="mt-1">Fast-moving item with quick checkout confidence.</p>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={adding || inventory <= 0}
                  className="w-full rounded-full bg-[#1f6cf2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1455c5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {adding ? "Processing..." : "Buy It Now"}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || inventory <= 0}
                  className="w-full rounded-full border border-[#1f6cf2] px-5 py-3 text-sm font-semibold text-[#1f6cf2] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {adding ? "Adding..." : "Add to cart"}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-black"
                >
                  <Heart size={16} />
                  Add to Watchlist
                </button>

                {addError ? (
                  <p className="text-sm text-red-600">{addError}</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <ShieldCheck size={18} />
                Buyer confidence
              </div>

              <div className="mt-5 space-y-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 text-gray-700" size={18} />
                  <div>
                    <p className="font-semibold text-gray-900">Shipping</p>
                    <p>
                      {shoppingMeta.shippingFee === 0
                        ? "Free shipping"
                        : `$${shoppingMeta.shippingFee.toFixed(2)} delivery fee`}{" "}
                      with dispatch from our nearest fulfilment point.
                    </p>
                    <p className="mt-1 text-gray-500">{shoppingMeta.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RefreshCcw className="mt-0.5 text-gray-700" size={18} />
                  <div>
                    <p className="font-semibold text-gray-900">Returns</p>
                    <p>{shoppingMeta.returnWindow}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 text-gray-700" size={18} />
                  <div>
                    <p className="font-semibold text-gray-900">Store assurance</p>
                    <p>
                      Secure checkout, tracked dispatch, and seller-backed support before and
                      after delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <ShoppingBag size={18} />
                Why shoppers buy here
              </div>

              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li>Clear pricing before checkout with visible savings.</li>
                <li>Delivery timing shown up front so there are no surprises.</li>
                <li>Stock, category, SKU, and condition available on the same screen.</li>
                <li>Related items included so comparison happens without leaving the page.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
