import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

export const ProductCard = ({
  productImage,
  rating,
  reviewCount,
  productName,
  size,
  originalPrice,
  discountPrice,
  discountPercentage,
  onClick,
}) => {
  const { darkMode } = useThemeContext();
  const defaultColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD700"];

  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (hovered && productImage.length > 1) {
      interval = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % productImage.length);
      }, 1200); // Slower transition for smooth effect
    } else {
      setImageIndex(0); // Reset to first image when hover stops
    }

    return () => clearInterval(interval);
  }, [hovered, productImage.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`min-w-[300px] sm:min-w-[340px] rounded-lg overflow-hidden shadow-md border-2
      ${
        darkMode
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      }
      transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image with Smooth Animation */}
      <div className="relative w-full h-64">
        {productImage.map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt={productName}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={imageIndex === index ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Wishlist Button */}
      <button
        className={`absolute top-2 right-2 p-2 rounded-full cursor-pointer transition-colors
        ${
          darkMode
            ? "bg-gray-700 hover:bg-red-600"
            : "bg-gray-400 bg-opacity-70 hover:bg-red-700"
        }`}
      >
        <Heart
          className={`h-6 w-6 ${darkMode ? "text-white" : "text-gray-100"}`}
        />
      </button>

      {/* Product Details */}
      <div className="p-4">
        {/* Rating */}
        <div
          className={`flex items-center mb-2 px-2 py-1 w-[100px] rounded-lg 
          ${darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900"}`}
        >
          <span className="text-lg">{rating}</span>
          <span className="text-yellow-500 mx-1">★</span>
          <span className="text-sm">{reviewCount}</span>
        </div>

        {/* Product Name */}
        <h3
          className={`text-lg font-medium ${
            darkMode ? "text-white" : "text-gray-800"
          } mb-1`}
        >
          {productName}
        </h3>

        {/* Size */}
        <p
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          } mb-2`}
        >
          Size: {size}
        </p>

        {/* Price Section */}
        <div className="flex items-center mb-3 tracking-wider">
          <span className="text-xl">₹{discountPrice}</span>
          <span
            className={`line-through text-sm ml-2 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            ₹{originalPrice}
          </span>
          <span className="ml-2 text-green-500 text-sm">
            ({discountPercentage}% OFF)
          </span>
        </div>

        {/* Color Options */}
        <div className="flex space-x-2">
          {defaultColors.map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border"
              style={{
                backgroundColor: color,
                borderColor: darkMode ? "#555" : "#ccc",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
