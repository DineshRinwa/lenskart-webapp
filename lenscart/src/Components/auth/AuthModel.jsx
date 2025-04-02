import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, EyeIcon, EyeOffIcon } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import { body } from "framer-motion/client";
const API_URL = import.meta.env.VITE_API_URL;
import login from "../../assets/login.svg";
import { useAuthContext } from "../../context/AuthContext";

export const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);
  const {user, setUser} = useAuthContext();

  // 🔹 Authentication Form State
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Reset form when toggling between login and signup
  useEffect(() => {
    setFormData({ username: "", email: "", password: "" });
    setErrors({});
    setTouched({});
    setApiError("");
    setFormSubmitted(false);
  }, [isLogin]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isLogin) {
          emailRef.current?.focus();
        } else {
          usernameRef.current?.focus();
        }
      }, 1000);
    }
  }, [isOpen, isLogin]);

  // 🔹 Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 🔹 Input Change Handler with Live Validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Only validate if the field has been touched or form was submitted
    if (touched[name] || formSubmitted) {
      validateField(name, value);
    }
  };

  // 🔹 Handle field blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  // 🔹 Single Field Validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error = "Password must contain at least one special character";
        }
        break;

      case "username":
        if (!isLogin && !value) {
          error = "Username is required";
        } else if (!isLogin && value.length < 3) {
          error = "Username must be at least 3 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  // 🔹 Full Form Validation
  const validateForm = () => {
    const validations = {};

    validations.email = validateField("email", formData.email);
    validations.password = validateField("password", formData.password);

    if (!isLogin) {
      validations.username = validateField("username", formData.username);
    }

    return Object.values(validations).every((isValid) => isValid);
  };

  // 🔹 Handle Form Submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setApiError("");
  //   setFormSubmitted(true);
  //   console.log(formData);

  //   if (!validateForm()) return;

  //   setLoading(true);

  //   try {
  //     // Simulate API delay in development
  //     if (NODE_ENV === "development") {
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     }

  //     const response = await fetch(
  //       isLogin ? "http://localhost:4040/api/auth/login" : "http://localhost:4040/api/auth/register",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(formData),
  //         credentials: "include",
  //       }
  //     );

  //     const data = await response.json();
  //     console.log(response)

  //     if (!response.ok) {
  //       throw new Error(data.message || "Authentication failed");
  //     }

  //     // Success: Store auth token and redirect
  //     if (data.token) {
  //       localStorage.setItem("authToken", data.token);
  //     }

  //     // Show success animation before redirecting
  //     setTimeout(() => navigate("/"), 500);
  //   } catch (error) {
  //     console.error("Auth error:", error);
  //     setApiError(error.message || "Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError("");
  setFormSubmitted(true);

  if (!validateForm()) return;

  setLoading(true);

  try {
    const response = await fetch(
      isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    const data = await response.json();
    localStorage.setItem("User", JSON.stringify(data.user));
    setUser(data.user);

    if(data.message) {
      toast.success(`${data.message}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }

    if(data.error) {
      toast.warn(`${data.error}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    // Success: Store auth token and redirect
    if (data.accessToken) {
      localStorage.setItem("authToken", data.accessToken);
      setTimeout(() => onClose(), 1000); 
      setTimeout(() => navigate("/"), 2000); // ✅ Redirect to Home after success
    }
  } catch (error) {
    console.error("Auth error:", error);
    setApiError(error.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // 🔹 Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthText = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.2 }}
        >
          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md mx-4 relative overflow-hidden"
            variants={modalVariants}
          >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full opacity-50"></div>

            {/* Background decoration */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-50"></div>

            {/* Login Img */}
            <img src={login} className="rounded-lg" alt="Login Img" />

            {/* 🔹 Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 text-white-500 hover:text-gray-800 text-black z-10 cursor-pointer rounded-lg p-2 bg-red-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X/>
            </motion.button>

            {/* 🔹 Header */}
            {/* <div className="mb-6 text-center relative z-10">
              <h2 className="text-3xl  text-gray-900 dark:text-white tracking-wider">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 tracking-wider">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill in your details to get started"}
              </p>
            </div> */}

            {/* 🔹 Toggle Buttons */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex w-full mt-5 mb-5">
                <motion.button
                  className={`relative py-2 w-1/2 rounded-md font-medium transition-all z-10 cursor-pointer ${
                    isLogin ? "text-white" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsLogin(true)}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign In
                  {isLogin && (
                    <motion.div
                      className="absolute inset-0 bg-blue-600 dark:bg-blue-700 rounded-md -z-10"
                      layoutId="authTab"
                    />
                  )}
                </motion.button>
                <motion.button
                  className={`relative py-2 w-1/2 rounded-md font-medium transition-all z-10 cursor-pointer ${
                    !isLogin ? "text-white" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsLogin(false)}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign Up
                  {!isLogin && (
                    <motion.div
                      className="absolute inset-0 bg-blue-600 dark:bg-blue-700 rounded-md -z-10"
                      layoutId="authTab"
                    />
                  )}
                </motion.button>
              </div>
            </div>

            {/* 🔹 API Error Message */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  className="mb-4 px-3 py-2 bg-red-100 border border-red-200 text-red-600 rounded-md relative z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm">{apiError}</p>
                  </div>
                  <button
                    onClick={() => setApiError("")}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔹 Form Fields */}
            <motion.form
              className="space-y-4 relative z-10"
              onSubmit={handleSubmit}
              layout
            >
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="username-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <input
                        ref={usernameRef}
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Username"
                        className={`w-full px-4 py-2.5 border dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg focus:outline-none transition-colors ${
                          errors.username && (touched.username || formSubmitted)
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : formData.username &&
                              "border-green-500 bg-green-50 dark:bg-green-900/20"
                        }`}
                      />
                      <AnimatePresence>
                        {formData.username && !errors.username && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute right-3 top-2.5 text-green-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.username &&
                        (touched.username || formSubmitted) && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors.username}
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative">
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email address"
                  className={`w-full px-4 py-2.5 border dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg focus:outline-none transition-colors ${
                    errors.email && (touched.email || formSubmitted)
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : formData.email &&
                        "border-green-500 bg-green-50 dark:bg-green-900/20"
                  }`}
                />
                <AnimatePresence>
                  {formData.email && !errors.email && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute right-3 top-2.5 text-green-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.email && (touched.email || formSubmitted) && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-1 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  className={`w-full px-4 py-2.5 pr-10 border dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-lg focus:outline-none transition-colors ${
                    errors.password && (touched.password || formSubmitted)
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : formData.password &&
                        "border-green-500 bg-green-50 dark:bg-green-900/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 cursor-pointer"
                >
                  {showPassword ? (        
                    <EyeOffIcon/>
                  ) : (
                    <EyeIcon/>
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (touched.password || formSubmitted) && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-1 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>


              {/* Password strength meter - only show when typing or for signup */}
              <AnimatePresence>
                {(formData.password && !isLogin) ||
                (formData.password && !isLogin && touched.password) ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2, 3].map((index) => (
                        <motion.div
                          key={index}
                          className={`h-1.5 rounded-full flex-1 ${
                            passwordStrength > index
                              ? strengthColor[passwordStrength - 1]
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Password strength:{" "}
                      {passwordStrength > 0
                        ? strengthText[passwordStrength - 1]
                        : "Too weak"}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* 🔹 Login Extras - only visible in login mode */}
              <AnimatePresence>
                {isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between items-center text-sm"
                  >
                    <label className="flex items-center text-gray-600 dark:text-gray-300">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 mr-2 cursor-pointer"
                      />
                      Remember me
                    </label>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🔹 Submit Button */}
              <motion.button
                type="submit"
                className="w-[60%] mx-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-4 px-6 rounded-4xl font-medium transition-all flex justify-center items-center cursor-pointer mt-10 mb-4 tracking-wider text-xl"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-r-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};