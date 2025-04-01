import {NavLink} from "./NavLink";

export const MobileMenu = () => {
  return (
    <div className="md:hidden flex flex-col space-y-3 py-3 bg-white shadow-lg border-t">
      <NavLink to="/" label="Home" />
      <NavLink to="/about" label="About" />
      <NavLink to="/services" label="Services" />
      <NavLink to="/contact" label="Contact" />
      <NavLink to="/login" label="Login" />
    </div>
  );
};
