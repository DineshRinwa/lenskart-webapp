import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  X,
  Menu,
  ShoppingCart,
  Heart,
  ReceiptText,
  Lock,
} from "lucide-react";
import { Bounce, toast } from "react-toastify";

import logo from "../../assets/logo.svg";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";
import { AuthModal } from "../auth/AuthModel";
import { ProfileDropdown } from "./ProfileDropdown"; // Import the new component
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuthContext();
  const { darkMode, setDarkMode } = useThemeContext();
  const navigate = useNavigate();

  const handleToggle = (value) => {
    toast.warn(`Please log in to view your ${value}.`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  return (
    <nav
      className={`shadow-md sticky top-0 z-50 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🔹 Logo */}
        <Link to="/">
          {" "}
          {darkMode ? (
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto bg-amber-50 rounded-md"
            />
          ) : (
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          )}
        </Link>

        {/* 🔹 Desktop Menu */}

        {/* 🔹 Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <NavLink to="/order" label="Orders" icon={ReceiptText} />
              <NavLink to="/wishlist" label="Wishlist" icon={Heart} />
              <NavLink to="/cart" label="Cart" icon={ShoppingCart} />
            </>
          ) : (
            <>
              <a
                href="#"
                onClick={() => handleToggle("Orders")}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:text-blue-600"
              >
                <ReceiptText
                  size={18}
                  className="hover:text-blue-500 cursor-pointer"
                />
                Order
              </a>

              <a
                href="#"
                onClick={() => handleToggle("Wishlist")}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:text-blue-600"
              >
                <Heart
                  size={18}
                  className="hover:text-blue-500 cursor-pointer"
                />
                Wishlist
              </a>

              <a
                href="#"
                onClick={() => handleToggle("Cart")}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:text-blue-600"
              >
                {
                  <ShoppingCart
                    size={18}
                    className="hover:text-blue-500 cursor-pointer"
                  />
                }
                Cart
              </a>
            </>
          )}

          {/* 🔹 User Profile or Login Button */}
          {user ? (
            <ProfileDropdown /> 
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 hover:text-blue-600 cursor-pointer"
            >
              <Lock size={18} />
              Sign Up & Sign In
            </button>
          )}

          {/* 🔹 Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl hover:cursor-pointer bg-red-600 p-2 rounded-3xl text-blue-100"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* 🔹 Mobile Menu Button */}

        {user ? (
           <div className="md:hidden absolute right-14 sm:right-18"><ProfileDropdown /></div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="md:hidden absolute right-14 sm:right-18 flex items-center gap-2 px-4 py-2 border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
          >
            <Lock size={18} />
            Login
          </button>
        )}

        <button
          className="md:hidden text-2xl hover:cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 🔹 Mobile Menu */}
      {menuOpen && <MobileMenu />}

      {/* 🔹 Login Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </nav>
  );
};
