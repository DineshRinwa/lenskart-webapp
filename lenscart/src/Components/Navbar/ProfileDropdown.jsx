import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShoppingBag, Heart } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const { darkMode } = useThemeContext();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Handle Logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <span
        className="py-[5px] px-[12px] rounded-3xl text-xl cursor-pointer font-bold bg-red-600 text-blue-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user?.username[0]?.toUpperCase()}
      </span>

      {/* Dropdown Card with Animation */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden origin-top-right transition-transform transform ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        >
          <div className="py-2 rounded-lg shadow-xl border dark:border-gray-700">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold">
                  {user?.username[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  navigate("/order");
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 rounded-lg font-medium transition-all duration-300 ease-in-out cursor-pointer ${
                  darkMode
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <ShoppingBag
                  size={20}
                  className={`${
                    darkMode
                      ? "text-gray-300 group-hover:text-white"
                      : "text-gray-600 group-hover:text-black"
                  } transition-all`}
                />
                <span>My Orders</span>
              </button>

              <button
                onClick={() => {
                  navigate("/wishlist");
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 rounded-lg font-medium transition-all duration-300 ease-in-out cursor-pointer ${
                  darkMode
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Heart
                  size={20}
                  className={`${
                    darkMode
                      ? "text-gray-300 group-hover:text-white"
                      : "text-gray-600 group-hover:text-black"
                  } transition-all`}
                />
                <span>My Wishlist</span>
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              <button
                onClick={handleLogout}
                className={`w-full px-4 py-2 flex items-center gap-3 rounded-lg font-medium transition-all duration-200 shadow-md cursor-pointer ${
                  darkMode
                    ? "bg-gray-800 text-red-400 hover:bg-gray-700 hover:text-red-300"
                    : "bg-red-600 text-white hover:bg-red-500 hover:shadow-lg"
                }`}
              >
                <LogOut
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};