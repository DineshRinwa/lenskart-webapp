import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Heart, ChevronDown, ChevronUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast, Bounce } from "react-toastify";
import { useThemeContext } from "../context/ThemeContext";
import { Spinner } from "./Spinner";
const API_URL = import.meta.env.VITE_API_URL;

export const SingleProduct = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [showTechInfo, setShowTechInfo] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); // check in wishlist
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { darkMode } = useThemeContext(); // Get theme
  const token = localStorage.getItem("authToken"); // Get Auth Token

  const location = useLocation();
  const product = location.state?.product; // Get the passed product

  //  Count Average Rating
  const averageRating = product?.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 0;

  //  Handle Add To Cart
  const handleAddToCart = async () => {
    if(!token) {
      toast.warn("Please login to add items to Cart", {
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
      return;
    }
    
    setIsBuyNowLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ productId: product._id }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // ✅ Show success toast
      toast.success("Cart Sucessfully Added", {
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
    } catch (error) {
      console.error("Auth error:", error);
      toast.warn("Something went wrong. Please try again.", {
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
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  // Handle Buy Now
  const handleBuyNow = async () => {

    if(!token) {
      toast.warn("Please Login to Buy Product", {
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
      return;
    }
    
    setIsBuyNowLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ productId: product._id }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // ✅ Show success toast
      toast.success("Order is ready for spinning.", {
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
    } catch (error) {
      console.error("Auth error:", error);
      toast.warn("Something went wrong. Please try again.", {
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
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  // Check In Wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!token || !product?._id) return;

      try {
        const response = await fetch(
          `${API_URL}/api/wishlist/check/${product._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsInWishlist(data.isInWishlist); // Set the boolean value, not the whole object
        } else {
          console.error("Failed to check wishlist status:", response.status);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product?._id, token, API_URL]);

  // Handle Wishlist
  const handleWishlistToggle = async () => {
    if (!token) {
      toast.warn("Please login to add items to wishlist", {
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
      return;
    }

    setIsWishlistLoading(true);

    try {
      const url = isInWishlist
        ? `${API_URL}/api/wishlist/remove/${product._id}`
        : `${API_URL}/api/wishlist/add`;

      const method = isInWishlist ? "DELETE" : "POST";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestOptions = {
        method,
        headers,
        credentials: "include",
      };

      // Only add body for POST requests
      if (!isInWishlist) {
        requestOptions.body = JSON.stringify({ productId: product._id });
      }

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update wishlist");
      }

      // Only toggle after successful API call
      const newWishlistState = !isInWishlist;
      setIsInWishlist(newWishlistState);

      // Show success toast based on the NEW state
      toast.success(
        newWishlistState ? "Added to wishlist" : "Removed from wishlist",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        }
      );
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist. Please try again.", {
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
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Sticky Product Data
  const productData = {
    brand: "Hooper",
    colors: [
      { id: "black", color: "#1a1a1a" },
      { id: "grey", color: "#aaaaaa" },
    ],
  };

  if (!product)
    return (
      <p className={darkMode ? "text-white" : "text-gray-900"}>
        No product found
      </p>
    );

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 p-4  ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Image Grid Section */}
      <div
        className={`w-full md:w-[70%] ${
          darkMode ? "border-gray-600" : "border-gray-200"
        }  p-2`}
      >
        <div className="grid grid-cols-2 gap-y-20 gap-x-10">
          {product.images?.map((img, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden ${
                darkMode ? "shadow-lg shadow-gray-900" : "shadow-md"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <img
                src={img}
                alt="Product Img"
                loading="lazy"
                className="w-full h-auto object-cover rounded-xl transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div
        className={`flex flex-col w-full h-[80rem] md:w-[30%] mx-auto p-2 border-4 rounded-2xl ${
          darkMode
            ? "bg-gray-700 text-white border-gray-600 shadow-lg shadow-gray-900"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        {/* Product Header */}
        <div className="flex justify-between items-center p-4">
          <h3
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {productData.brand}
          </h3>

          <span
            className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
              darkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-600"
                : "text-gray-600 hover:text-white hover:bg-gray-600"
            }`}
            onClick={handleWishlistToggle}
          >
            {isWishlistLoading ? (
              <Spinner />
            ) : (
              <Heart
                className={`w-6 h-6 ${
                  isInWishlist ? "fill-current text-red-500" : ""
                }`}
              />
            )}
          </span>
        </div>

        {/* Product Title */}
        <div className="px-4 pb-2">
          <h2 className="text-lg font-medium tracking-wider">
            {product.frame_color}
          </h2>
        </div>

        {/* Product Size */}
        <div className="px-4 flex items-center">
          <span
            className={`text-sm tracking-wider ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Size : {product.frame_size}
          </span>
          <svg
            className={`w-4 h-4 ml-1 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>

        {/* Price */}
        <div className="px-4 py-3">
          <div className="flex items-center">
            <span
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } line-through`}
            >
              ₹ {product.price_inr}
            </span>
            <span className="ml-2 text-sm text-green-500">
              ({product.discount_percentage}% OFF)
            </span>
          </div>
          <div className="text-xl tracking-wider mt-1">
            ₹ {product.discount_price_inr}
          </div>
        </div>

        {/* Frame + Lens */}
        <div className="px-4 pb-4">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } mb-2`}
          >
            Frame + Lens
          </div>
          <div className="flex space-x-3">
            {productData.colors.map((color) => (
              <button
                key={color.id}
                className={`w-8 h-8 rounded-full focus:outline-none cursor-pointer ${
                  selectedColor === color.id
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                style={{ backgroundColor: color.color }}
                onClick={() => setSelectedColor(color.id)}
                aria-label={`Select ${color.id} color`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="px-4 pb-4">
          <button
            className="w-full py-3 bg-cyan-500 text-white font-medium rounded text-center mb-3 cursor-pointer flex justify-center items-center"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

          <button
            className={`w-full py-3 border ${
              darkMode ? "border-gray-600" : "border-gray-300"
            } rounded flex justify-center items-center cursor-pointer`}
            onClick={handleAddToCart}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
              </svg>
              <span>Add To Cart</span>
            </div>
          </button>
        </div> */}

        <div className="px-4 pb-4">
          <button
            className="w-full py-3 bg-cyan-500 text-white font-medium rounded text-center mb-3 cursor-pointer flex justify-center items-center"
            onClick={handleBuyNow}
            disabled={isBuyNowLoading}
          >
            {isBuyNowLoading ? <Spinner /> : "Buy Now"}
          </button>

          <button
            className={`w-full py-3 border ${
              darkMode ? "border-gray-600" : "border-gray-300"
            } rounded flex justify-center items-center cursor-pointer`}
            onClick={handleAddToCart}
            disabled={isAddToCartLoading}
          >
            {isAddToCartLoading ? (
              <Spinner />
            ) : (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
                </svg>
                <span>Add To Cart</span>
              </div>
            )}
          </button>
        </div>

        {/* Technical Information */}
        <div
          className={`border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setShowTechInfo(!showTechInfo)}
            className="w-full py-4 px-4 flex justify-between items-center cursor-pointer"
          >
            <span
              className={`font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Technical Information
            </span>
            {showTechInfo ? (
              <ChevronUp
                className={`w-4 h-4 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              />
            ) : (
              <ChevronDown
                className={`w-4 h-4 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              />
            )}
          </button>
          {showTechInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`p-4 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              } rounded-md flex flex-row`}
            >
              <div className="w-[40%] flex flex-col text-sm">
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  Product Id
                </span>{" "}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  Model No.
                </span>{" "}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  Frame Size
                </span>{" "}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  Frame width
                </span>{" "}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  Frame Dimensions
                </span>{" "}
              </div>

              <div className="w-[60%] flex flex-col text-sm">
                <span>{product.product_id}</span>
                <span>{product.model_no}</span>
                <span>{product.frame_size}</span>
                <span>{product.frame_width} mm</span>
                <span>{product.frame_dimensions}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reviews */}
        <div
          className={`border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <button
            className="w-full py-4 px-4 flex justify-between items-center cursor-pointer"
            onClick={() => setShowReviews(!showReviews)}
          >
            <span
              className={`font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Review
              <span
                className={`font-normal ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {" "}
                ({product.reviews.length})
              </span>
            </span>
            {showReviews ? (
              <ChevronUp
                className={`w-4 h-4 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              />
            ) : (
              <ChevronDown
                className={`w-4 h-4 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              />
            )}
          </button>

          {showReviews && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`p-4 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              } rounded-md space-y-4`}
            >
              {product.reviews.map((review, index) => (
                <div
                  key={review._id}
                  className={`flex items-start space-x-3 p-3 ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  } rounded-lg ${
                    darkMode ? "shadow-md shadow-gray-900" : "shadow-sm"
                  }`}
                >
                  {/* User Icon (Optional) */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      darkMode
                        ? "bg-gray-600 text-gray-200"
                        : "bg-gray-300 text-gray-700"
                    } font-bold`}
                  >
                    {review.user.charAt(0).toUpperCase()}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    {/* User Name & Star Rating */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {review.user}
                      </span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : darkMode
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                            fill={i < review.rating ? "currentColor" : "none"}
                            stroke="currentColor"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <p
                      className={`mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } text-sm`}
                    >
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Rating Display */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < averageRating
                    ? "text-yellow-400"
                    : darkMode
                    ? "text-gray-600"
                    : "text-gray-300"
                }`}
                fill={i < averageRating ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
            <span
              className={`ml-2 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } font-medium`}
            >
              {averageRating.toFixed(1)} ⭐ ({product.reviews.length} Reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
