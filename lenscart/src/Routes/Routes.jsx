import { Routes, Route } from "react-router-dom";
import { OrderPage } from "../Pages/OrderPage";
import { WishlistPage } from "../Pages/WishlistPage";
import { CartPage } from "../Pages/CartPage";
import { ProfilePage } from "../Pages/ProfilePage";
import { SingleProduct } from "../Utils/SingleProduct";

export const Routing = () => {
    const Home = () => (
      <h1 className="text-center mt-10 text-3xl">Home</h1>
    );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/one_product" element={<SingleProduct />} />
    </Routes>
  );
};