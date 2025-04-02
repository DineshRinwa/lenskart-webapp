import { NavLink as RouterNavLink } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";

export const NavLink = ({ to, label, icon: Icon }) => {
  let { darkMode } = useThemeContext();
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 transition-colors duration-300 tracking-wider ${
          isActive
            ? darkMode
              ? "text-blue-400"
              : "text-blue-600"
            : darkMode
            ? "text-white"
            : "text-gray-900"
        }`
      }
    >
      {Icon && <Icon size={20} />}
      {label}
    </RouterNavLink>
  );
};
