import { NavLink } from "./NavLink";

export const MobileMenu = () => {
  return (
    <div className="md:hidden flex flex-col space-y-3 py-3 bg-white shadow-lg border-t">
      <NavLink to="/" label="Home" />
      <NavLink to="/order" label="Order" />
      <NavLink to="/wishlist" label="Wishlist" />
      <NavLink to="/Cart" label="Cart" />
    </div>
  );
};
