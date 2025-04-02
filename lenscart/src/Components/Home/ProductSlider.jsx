import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";

export const ProductSlider = ({onSlideClick}) => {
  const products = [
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/image179.png",
      name: "Round",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/cateeye.jpg",
      name: "Cat-Eye",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/clubmaster.jpg",
      name: "Clubmaster",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/trans.jpg",
      name: "Transparent",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/blend.jpg",
      name: "Blend Edit",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/clipon.jpg",
      name: "Air Clip On",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/airflex.jpg",
      name: "Air Flex",
    },
    {
      img: "https://static1.lenskart.com/media/desktop/img/Sep21/aviator.jpg",
      name: "Retro Aviator",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const { darkMode } = useThemeContext();

  // Handle responsive visible items
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1); // Mobile
      } else if (width < 768) {
        setVisibleCount(2); // Small tablets
      } else if (width < 1024) {
        setVisibleCount(3); // Tablets
      } else {
        setVisibleCount(4); // Desktop
      }
    };

    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 4) % products.length);
  };

  const handlePrev = () => {
    setStartIndex(
      (prevIndex) => (prevIndex - 4 + products.length) % products.length
    );
  };

  const visibleProducts = [...products, ...products].slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <div className="mt-25">
      <div className="relative flex items-center justify-center mt-6 md:mt-10 px-4 text-3xl md:text-4xl lg:text-5xl text-center before:content-[''] before:absolute before:left-0 before:w-16 md:before:w-40 lg:before:w-100 before:h-[1px] before:bg-gray-500 before:top-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:right-0 after:w-16 md:after:w-40 lg:after:w-100 after:h-[1px] after:bg-gray-500 after:top-1/2 after:-translate-y-1/2">
        Our <span className="text-red-600 px-2 md:px-4">Hottest</span>{" "}
        Collections
      </div>

      <div
        className={`relative w-full h-auto max-w-[80rem] mx-auto  flex justify-evenly transition-all duration-300 mt-4 md:mt-10 p-4 md:p-10 ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-900"
        }`}
      >
        {/* Left Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 dark:bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Product Container */}
        <motion.div className="flex gap-2 md:gap-4 overflow-hidden px-8 md:px-12 w-full justify-center" >
          {visibleProducts.map((product, index) => (
            <motion.div
              key={index}
              layout
              transition={{ type: "spring", stiffness: 200 }}
              className={`w-full sm:w-40 md:w-48 lg:w-60 rounded-lg shadow-md flex flex-col items-center cursor-pointer border-2 transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-auto object-cover rounded-md"
              />
              <h3 className="mt-2 text-base md:text-lg tracking-wider p-2 text-center">
                {product.name}
              </h3>

              <button
                className={`mt-2 md:mt-4 mb-2 md:mb-4 px-4 md:px-6 py-1 md:py-2 text-sm md:text-md rounded-xl tracking-wider cursor-pointer transition-all ${
                  darkMode
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-400"
                }`}
                onClick={onSlideClick}
              >
                Explore
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 dark:bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
