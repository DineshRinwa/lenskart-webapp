import { useEffect, useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { ProductCardSkeleton } from "../../Utils/ProductCardSkeleton";
import { TitleSkeleton } from "../../Utils/TitleSkeleton";
import { ProductCard } from "../../Utils/ProductCard";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const Cart = () => {
  const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  //  Price
  const [MRP, setMRP] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    const calculatePrices = () => {
      const totalMRP = orderData.reduce((accumulator, item) => {
        const price = item.price_inr; // Use MRP price
        return accumulator + price;
      }, 0);

      const totalAfterDiscount = orderData.reduce((accumulator, item) => {
        const price = item.discount_price_inr; // Use discounted price
        return accumulator + price;
      }, 0);

      const totalDiscount = totalMRP - totalAfterDiscount; // Total discount
      const discountPercent = Math.floor((totalDiscount / totalMRP) * 100); // Discount percentage

      setMRP(totalMRP);
      setAfterDiscount(totalAfterDiscount);
      setDiscountPercentage(discountPercent);
    };

    calculatePrices();
  }, [orderData]);


  useEffect(() => {
    const getOrder = async () => {
      const token = localStorage.getItem("authToken");
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/cart/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        });

        const data = await response.json();
        const products = data.cart.map((item) => item.productId);
        setOrderData(products);

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
    navigate("/one_product", { state: { product } });
  };

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

  // Function to remove product from the cart
  const handleRemove = async (productId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Remove product from the orderData state
        setOrderData((prevOrderData) =>
          prevOrderData.filter((product) => product._id !== productId)
        );
      } else {
        throw new Error(data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
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
          <>
            <h1 className="text-4xl text-center py-8 tracking-wide">
              All Cart Products
            </h1>

            {/* <p className="p-4 rounded-4xl text-xl bg-gray-600 text-white text-center w-[20%]">
              Total Price : {}
            </p> */}

            <div className="flex items-center mb-3 p-4 bg-gray-600 rounded-4xl tracking-wider justify-center max-w-[20rem]">
              <span className="text-xl text-white">₹{afterDiscount}</span>
              <span
                className={`line-through text-sm ml-2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                ₹{MRP}
              </span>
              <span className="ml-2 text-green-500 text-sm">
                ({discountPercentage}% OFF)
              </span>
            </div>
          </>
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
              <div
                key={index}
                className="relative group hover:scale-105 transition-transform duration-300"
              >
                <ProductCard {...mapProductDataToProps(order)} />
                <button
                  className="absolute bottom-3 right-3 mt-2 mr-2 cursor-pointer tracking-wider bg-blue-500 hover:bg-red-500 text-white px-4 py-2 rounded-full transform group-hover:scale-105 transition-transform duration-300"
                  onClick={() => handleRemove(order._id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-xl tracking-wider">No cart found!</p>

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
