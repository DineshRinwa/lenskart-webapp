import { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create Context
const ThemeContext = createContext();

// 2️⃣ Create Provider Component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // 3️⃣ Load theme from local storage on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // 4️⃣ Update Local Storage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5 Custom Hook for Easy Access
export const useThemeContext = () => {
  return useContext(ThemeContext);
};