import { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create Context
const AuthContext = createContext();

// 2️⃣ Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 3️⃣ Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // ✅ Parse only if valid
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("User"); // ❌ Remove corrupted data
      }
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4️⃣ Custom Hook for Easy Access
export const useAuthContext = () => {
  return useContext(AuthContext);
};