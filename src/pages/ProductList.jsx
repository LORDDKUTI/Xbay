import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import api from "../api/api";
import useCart from "../hooks/useCart";

const fallbackDeals = [
  {
    slug: "skincare",
    title: "Glow Week",
    category: "Skincare",
    description: "Hydration picks, cleansers, and bright skin deals.",
    accent: "from-[#5b3df5] via-[#6547ff] to-[#8970ff]",
  },
  {
    slug: "fragrance",
    title: "Fragrance Finds",
    category: "Fragrance",
    description: "Fresh scents and signature bottles with limited drops.",
    accent: "from-[#111827] via-[#1f2937] to-[#374151]",
  },
  {
    slug: "makeup",
    title: "Makeup Edit",
    category: "Makeup",
    description: "Everyday staples and bold looks at better prices.",
    accent: "from-[#f43f5e] via-[#fb7185] to-[#fda4af]",
  },
  {
    slug: "accessories",
    title: "Accessory Rush",
    category: "Accessories",
    description: "Finish the look with add-ons worth grabbing now.",
    accent: "from-[#0891b2] via-[#06b6d4] to-[#67e8f9]",
  },
];

const ProductCard = ({ p }) => {
  const [added, setAdded] = useState(false);
  const { addToCart, loading, error } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(p.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Add to cart failed", err?.message || err);
    }
  };

  return (
    <div className="group">
      <div className="aspect-3/4 overflow-hidden rounded bg-gray-100">
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
        <p className="text-sm text-gray-500">{p.sku}</p>
        <p className="text-sm font-semibold">${Number(p.price).toFixed(2)}</p>
        <p className="text-xs text-gray-400">
          {p.inventory > 0 ? `${p.inventory} in stock` : "Out of stock"}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Link to={`/products/${p.id}`} className="text-xs underline">
          View
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={loading || p.inventory === 0}
          className="ml-auto rounded bg-black px-3 py-1 text-xs text-white disabled:opacity-50"
        >
          {loading ? "..." : added ? "Added" : "Add"}
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

const DealsSlider = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    const categories = [];

    products.forEach((product) => {
      const category = product.category?.trim();
      if (!category) return;

      if (!categories.some((item) => item.category.toLowerCase() === category.toLowerCase())) {
        categories.push({
          slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: `${category} Deals`,
          category,
          description: `Fresh picks and standout offers in ${category.toLowerCase()}.`,
        });
      }
    });

    const combined = [...categories, ...fallbackDeals].reduce((acc, item) => {
      if (!acc.some((entry) => entry.slug === item.slug)) {
        acc.push(item);
      }
      return acc;
    }, []);

    return combined.slice(0, 4).map((slide, index) => ({
      ...fallbackDeals[index],
      ...slide,
    }));
  }, [products]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => {
          const previewProducts = products
            .filter(
              (product) =>
                product.category?.toLowerCase() === slide.category.toLowerCase()
            )
            .slice(0, 4);

          return (
            <div key={slide.slug} className="min-w-full">
              <div
                className={`grid gap-6 bg-linear-to-br ${slide.accent} px-6 py-8 text-white md:grid-cols-[1.1fr_0.9fr] md:px-8`}
              >
                <div className="max-w-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    Featured Deals
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight">
                    {slide.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    {slide.description}
                  </p>

                  <Link
                    to={`/deals/${slide.slug}`}
                    className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-100"
                  >
                    Shop {slide.category}
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {previewProducts.length > 0
                    ? previewProducts.map((product) => (
                        <div
                          key={product.id}
                          className="overflow-hidden rounded-2xl bg-white/20 backdrop-blur-sm"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-28 w-full object-cover md:h-36"
                          />
                        </div>
                      ))
                    : [...Array(4)].map((_, index) => (
                        <div
                          key={`${slide.slug}-${index}`}
                          className="flex h-28 items-end rounded-2xl bg-white/15 p-3 md:h-36"
                        >
                          <span className="text-sm font-medium text-white/80">
                            {slide.category}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        {slides.map((slide, index) => (
          <button
            key={slide.slug}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-7 bg-black" : "w-2.5 bg-gray-300"
            }`}
            aria-label={`Show ${slide.category} deals`}
          />
        ))}
      </div>
    </section>
  );
};

const TodayDealsCarousel = ({ products }) => {
  const scrollRef = useRef(null);

  const dealProducts = useMemo(
    () =>
      products.slice(0, 8).map((product, index) => ({
        ...product,
        dealTag: `${15 + index * 5}% OFF`,
        oldPrice: Number(product.price) * 1.2,
      })),
    [products]
  );

  if (!dealProducts.length) {
    return null;
  }

  const scrollByCards = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector("[data-deal-card]");
    const gap = 16;
    const cardWidth = firstCard ? firstCard.clientWidth + gap : 260;

    container.scrollBy({
      left: direction * cardWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-10 rounded-2xl border border-gray-200 bg-[#f7f7f7] p-5 md:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Today's Deals</h2>
          <p className="text-sm text-gray-500">All with fresh offers worth grabbing now</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="rounded-full border border-gray-300 bg-white p-2 text-gray-700 transition hover:border-black hover:text-black"
            aria-label="Previous deals"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="rounded-full border border-gray-300 bg-white p-2 text-gray-700 transition hover:border-black hover:text-black"
            aria-label="Next deals"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dealProducts.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            data-deal-card
            className="group min-w-45 snap-start rounded-[1.6rem] bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-w-52 lg:min-w-60"
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
                className="h-36 w-full object-cover transition group-hover:scale-105 md:h-44"
              />
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">
                {product.dealTag}
              </p>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-gray-900">
                {product.name}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-semibold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [stickySearchVisible, setStickySearchVisible] = useState(false);
  const filterRef = useRef(null);
  const lastScrollY = useRef(0);

  const fetchProducts = async (p = page, q = search, ord = ordering) => {
    setLoading(true);

    try {
      const params = { page: p, page_size: pageSize };
      if (q) params.search = q;
      if (ord) params.ordering = ord;

      const res = await api.get("products/", { params });
      setProducts(res.data.results || []);
      setCount(res.data.count || 0);
      setPage(p);
    } catch (er) {
      console.error("Fetch products error:", er?.response?.data || er);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, search, ordering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollY.current;
      const scrollingUp = currentY < previousY;
      const scrollingDown = currentY > previousY;
      const filterBottom =
        (filterRef.current?.offsetTop || 0) +
        (filterRef.current?.offsetHeight || 0);
      const pastFilters = currentY > filterBottom - 40;

      if (!pastFilters) {
        setStickySearchVisible(false);
      } else if (scrollingUp && previousY - currentY > 10) {
        setStickySearchVisible(true);
      } else if (scrollingDown && currentY - previousY > 12) {
        setStickySearchVisible(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, search, ordering);
  };

  const onOrderingChange = (value) => {
    setOrdering(value);
    fetchProducts(1, search, value);
  };

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
      <div
        className={`sticky top-0 z-30 -mx-4 border-b border-gray-200 bg-white/95 px-4 backdrop-blur transition-all duration-300 md:-mx-6 md:px-6 ${
          stickySearchVisible
            ? "translate-y-0 py-3 shadow-sm"
            : "-translate-y-full py-2 shadow-none"
        }`}
      >
        <form onSubmit={onSearch} className="mx-auto flex max-w-4xl items-center gap-2">
          <div className="flex flex-1 items-center rounded-full border border-gray-300 bg-white px-2 shadow-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for anything"
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none md:text-base"
            />
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <section ref={filterRef} className="border-b border-gray-100 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            All Products
          </h1>
          <p className="mt-2 text-sm text-gray-500">{count} items found</p>
        </div>

        <form
          onSubmit={onSearch}
          className="rounded-3xl border border-gray-200 bg-[#faf7f2] p-4 md:p-5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex flex-1 items-center rounded-full border border-gray-300 bg-white px-2 shadow-sm">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for anything"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none md:text-base"
                />
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Filters
                </span>
                <select
                  value={ordering}
                  onChange={(e) => onOrderingChange(e.target.value)}
                  className="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none"
                >
                  <option value="-created_at">Newest first</option>
                  <option value="created_at">Oldest first</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name A to Z</option>
                  <option value="-name">Name Z to A</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-gray-200 pt-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
                  Category
                </h4>
                <ul className="flex flex-wrap gap-2 text-sm">
                  <li className="cursor-pointer rounded-full border border-black bg-black px-4 py-2 text-white">
                    All
                  </li>
                  <li className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition hover:border-black hover:text-black">
                    Skincare
                  </li>
                  <li className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition hover:border-black hover:text-black">
                    Fragrance
                  </li>
                  <li className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition hover:border-black hover:text-black">
                    Makeup
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
                  Price Range
                </h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Under $50
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    $50 - $100
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    $100+
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>

      <DealsSlider products={products} />
      <TodayDealsCarousel products={products} />

      <div className="flex gap-12 pt-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-8">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                Browse
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="cursor-pointer hover:text-black">Best Sellers</li>
                <li className="cursor-pointer hover:text-black">New Arrivals</li>
                <li className="cursor-pointer hover:text-black">Gift Sets</li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid animate-pulse grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-3/4 rounded-sm bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}

          <div className="mt-20 flex justify-center border-t border-gray-100 pt-10">
            <button
              disabled={page <= 1}
              onClick={() => fetchProducts(page - 1)}
              className="px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchProducts(page + 1)}
              className="px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;
