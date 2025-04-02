import { Routes, Route } from "react-router-dom";
import { OrderPage } from "../Pages/OrderPage";
import { WishlistPage } from "../Pages/WishlistPage";
import { CartPage } from "../Pages/CartPage";
import { ProfilePage } from "../Pages/ProfilePage";
import { SingleProduct } from "../Utils/SingleProduct";
import { HomePage } from "../Pages/HomePage";
import { GetAllProduct } from "../Components/Product/GetAllProduct";

export const Routing = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/one_product" element={<SingleProduct />} />
      <Route path="/all_products" element={<GetAllProduct/>} />
    </Routes>
  );
};