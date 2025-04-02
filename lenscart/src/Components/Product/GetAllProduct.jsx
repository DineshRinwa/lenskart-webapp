import { useEffect, useState, useRef, useCallback } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { ProductCardSkeleton } from "../../Utils/ProductCardSkeleton";
import { ProductCard } from "../../Utils/ProductCard";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const GetAllProduct = () => {
  const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    frame_color: "",
    frame_size: "",
    minRating: "",
    search: "",
  });
  const [sortOption, setSortOption] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [filterVisible, setFilterVisible] = useState(false);

  const navigate = useNavigate();
  const observer = useRef();
  const limit = 6; // Number of products per page

  // Color options for filter dropdown
  const colorOptions = [
    "Denim-Ace",
    "Black",
    "Tortoise",
    "Grey",
    "Blue",
    "Brown",
    "Gold",
  ];

  // Frame size options for filter dropdown
  const sizeOptions = ["Small", "Medium", "Large", "Extra Large"];

  // Last element reference for infinite scrolling
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  // Function to load products with current filters and sort options
  const fetchProducts = async (reset = false) => {
    const currentPage = reset ? 1 : page;
    if (reset) {
      setLoading(true);
      setOrderData([]);
    } else {
      setLoadingMore(true);
    }

    const token = localStorage.getItem("authToken");
    let url = new URL(`${API_URL}/api/products`);

    // Add query parameters
    url.searchParams.append("page", currentPage);
    url.searchParams.append("limit", limit);
    url.searchParams.append("sortBy", sortOption.sortBy);
    url.searchParams.append("sortOrder", sortOption.sortOrder);

    // Add filter parameters if they exist
    if (filters.minPrice) url.searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) url.searchParams.append("maxPrice", filters.maxPrice);
    if (filters.frame_color)
      url.searchParams.append("frame_color", filters.frame_color);
    if (filters.frame_size)
      url.searchParams.append("frame_size", filters.frame_size);
    if (filters.minRating)
      url.searchParams.append("minRating", filters.minRating);
    if (filters.search) url.searchParams.append("search", filters.search);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setTotalProducts(data.totalProducts);

      if (reset) {
        setOrderData(data.products);
        setPage(1);
      } else {
        setOrderData((prevData) => [...prevData, ...data.products]);
      }

      setHasMore(data.currentPage < data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(true);
  }, []);

  // Load more products when scrolling
  const loadMoreProducts = () => {
    if (hasMore && !loading && !loadingMore) {
      setPage((prevPage) => prevPage + 1);
      fetchProducts();
    }
  };

  // Apply filters and reset pagination
  const applyFilters = () => {
    fetchProducts(true);
    setFilterVisible(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      frame_color: "",
      frame_size: "",
      minRating: "",
      search: "",
    });
    setSortOption({
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    // Reset and fetch products
    fetchProducts(true);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle sort changes
  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    setSortOption({ sortBy, sortOrder });
    setPage(1);
    fetchProducts(true);
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(true);
  };

  // Navigation to product detail
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

  return (
    <div
      className={`border-2 rounded-2xl p-5 m-5 pb-15 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className={`w-full p-3 pr-10 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Sort Dropdown */}
          <div className="w-full md:w-1/4">
            <select
              value={`${sortOption.sortBy}-${sortOption.sortOrder}`}
              onChange={handleSortChange}
              className={`w-full p-3 rounded-lg border cursor-pointer ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="discount_price_inr-asc">Price: Low to High</option>
              <option value="discount_price_inr-desc">
                Price: High to Low
              </option>
              <option value="discount_percentage-desc">Highest Discount</option>
            </select>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className={`px-4 py-3 rounded-lg border cursor-pointer ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
            </div>
          </button>
        </div>

        {/* Filter Panel */}
        {filterVisible && (
          <div
            className={`p-4 rounded-lg mb-4  ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className={`w-full p-2 rounded border ${
                      darkMode
                        ? "bg-gray-800 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className={`w-full p-2 rounded border ${
                      darkMode
                        ? "bg-gray-800 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* Frame Color */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Frame Color
                </label>
                <select
                  name="frame_color"
                  value={filters.frame_color}
                  onChange={handleFilterChange}
                  className={`w-full p-2 rounded border cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">All Colors</option>
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frame Size */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Frame Size
                </label>
                <select
                  name="frame_size"
                  value={filters.frame_size}
                  onChange={handleFilterChange}
                  className={`w-full p-2 rounded border cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">All Sizes</option>
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block mb-2 text-sm font-medium cursor-pointer">
                  Min Rating
                </label>
                <select
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  className={`w-full p-2 rounded border cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">Any Rating</option>
                  <option value="4">4★ & Above</option>
                  <option value="3">3★ & Above</option>
                  <option value="2">2★ & Above</option>
                  <option value="1">1★ & Above</option>
                </select>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded cursor-pointer ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className={`px-4 py-2 rounded cursor-pointer ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm mt-2">
          Showing {orderData.length} out of {totalProducts} products
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-30 gap-x-14 items-center justify-evenly pt-5 px-2 md:px-4 lg:px-25">
        {loading && orderData.length === 0 ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : orderData && orderData.length > 0 ? (
          orderData.map((product, index) => {
            if (orderData.length === index + 1) {
              // Add reference to last element for infinite scrolling
              return (
                <div ref={lastProductElementRef} key={index}>
                  <ProductCard {...mapProductDataToProps(product)} />
                </div>
              );
            } else {
              return (
                <ProductCard
                  key={product._id || index}
                  {...mapProductDataToProps(product)}
                />
              );
            }
          })
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-xl tracking-wider">No products found!</p>
            <button
              onClick={clearFilters}
              className={`mt-4 px-12 py-4 text-xl rounded-lg tracking-wider cursor-pointer ${
                darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
              }`}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center my-6">
          <div className="loader w-10 h-10 border-4 border-t-4 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
