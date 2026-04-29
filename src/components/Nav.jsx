import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { clearAuth } from "../api/api";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        if (mounted) {
          setUser(null);
          setCheckingAuth(false);
        }
        return;
      }

      try {
        const res = await api.get("/auth/user/");
        if (mounted) {
          setUser(res?.data || null);
        }
      } catch (err) {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (err) {
      console.log("Logout request failed:", err?.response?.data || err);
    } finally {
      clearAuth();
      localStorage.removeItem("refresh");
      setUser(null);
      navigate("/login");
    }
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "font-semibold text-black"
      : "text-gray-500 transition hover:text-black";

  return (
    <header className="border-b border-gray-200 bg-white text-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button
          onClick={() => navigate("/")}
          className="text-lg font-bold tracking-tight"
        >
          YourStore
        </button>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/products" className={linkClass("/products")}>
            Shop
          </Link>
          <Link to="/cart" className={linkClass("/cart")}>
            Cart
          </Link>
          {user ? (
            <Link to="/manager/products/list" className={linkClass("/manager/products/list")}>
              Manager
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {checkingAuth ? (
            <span className="text-sm text-gray-400">...</span>
          ) : user ? (
            <>
              <button
                onClick={() => navigate("/cart")}
                className="hidden rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:border-black hover:text-black md:block"
              >
                Cart
              </button>
              <div className="hidden text-right md:block">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                  Signed in
                </p>
                <p className="text-sm font-semibold">{user.username || "User"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="hidden rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:border-black hover:text-black md:block"
              >
                Create account
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white transition hover:bg-gray-800"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
