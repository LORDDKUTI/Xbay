import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

const slugToCategory = (slug) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const DealCategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categoryName = useMemo(() => slugToCategory(slug || ""), [slug]);

  useEffect(() => {
    let mounted = true;

    const fetchDeals = async () => {
      setLoading(true);
      setError("");

      try {
        const categoryRes = await api.get("/products/", {
          params: { page_size: 48, category: categoryName },
        });

        const categoryProducts = categoryRes.data.results || categoryRes.data || [];

        if (mounted && categoryProducts.length > 0) {
          setProducts(categoryProducts);
          return;
        }

        const fallbackRes = await api.get("/products/", {
          params: { page_size: 48, search: categoryName },
        });

        if (mounted) {
          setProducts(fallbackRes.data.results || fallbackRes.data || []);
        }
      } catch (err) {
        console.error(
          "Error fetching deal products:", err?.response?.data || err.message
        );
        if (mounted) {
          setError("Failed to load deal products.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDeals();

    return () => {
      mounted = false;
    };
  }, [categoryName]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="rounded-3xl bg-linear-to-r from-black via-gray-900 to-gray-700 px-6 py-10 text-white md:px-8">
        <Link to="/products" className="text-sm text-white/75 hover:text-white">
          Back to all products
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Deals Category
        </p>
        <h1 className="mt-3 text-4xl font-semibold">{categoryName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          A focused page for {categoryName.toLowerCase()} picks, highlights, and the best matching deals we currently have.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-3/4 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <p className="text-lg font-medium text-gray-900">
              No live deals found for {categoryName}.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try another category from the deals slider.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-3/4 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>

                <div className="space-y-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                    {product.category || categoryName}
                  </p>
                  <p className="line-clamp-2 text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">{product.sku}</p>
                  <p className="text-base font-semibold text-black">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCategoryPage;
