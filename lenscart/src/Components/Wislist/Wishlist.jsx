import { useEffect, useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { ProductCardSkeleton } from "../../Utils/ProductCardSkeleton";
import { TitleSkeleton } from "../../Utils/TitleSkeleton";
import { ProductCard } from "../../Utils/ProductCard";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const Wishlist = () => {
  const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrder = async () => {
      const token = localStorage.getItem("authToken");
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/wishlist/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        });

        const data = await response.json();
        setOrderData(data.wishlist);

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, []);

  const handleClick = (product) => {
    navigate('/one_product', { state: { product } });
  }

  // Function to transform product data to match ProductCard props
  const mapProductDataToProps = (product) => {
    return {
      productImage: product.images || [],
      rating:
        product.reviews && product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews ? product.reviews.length : 0,
      productName: product.model_no || "Product",
      size: product.frame_size || "N/A",
      originalPrice: product.price_inr || 0,
      discountPrice: product.discount_price_inr || 0,
      discountPercentage: product.discount_percentage || 0,
      colorOptions: [product.frame_color], // This would ideally be converted to a color code
      onClick: () => handleClick(product),
    };
  };

  return (
    <>
      <div
        className={`rounded-2xl p-5 m-5 pb-15 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* 🔹 Heading */}
        {loading ? (
          <TitleSkeleton />
        ) : (
          <h1 className="text-4xl text-center py-8 tracking-wide">
            My Wishlist
          </h1>
        )}

        <div className="flex flex-wrap gap-5 m-auto items-center justify-evenly pt-5">
          {loading ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : orderData && orderData.length > 0 ? (
            orderData.map((order, index) => (
              <ProductCard key={index} {...mapProductDataToProps(order)} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-xl tracking-wider">No wishlist found!</p>
              <button
                onClick={() => navigate("/")}
                className={`mt-4 px-12 py-4 text-xl rounded-4xl tracking-wider cursor-pointer ${
                  darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                }`}
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
