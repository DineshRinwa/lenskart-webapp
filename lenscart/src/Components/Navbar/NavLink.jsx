import { Link } from "react-router-dom";

export const NavLink = ({ to, label, icon: Icon }) => {
  return (
    <Link to={to} className="flex items-center gap-2 px-4 py-2 hover:text-blue-600">
      {Icon && <Icon size={20} />}
      {label}
    </Link>
  );
};
