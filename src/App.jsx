// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; // ✅ muhim!
import Navbar from "./components/Navbar";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import MenuPage from "./pages/Menus";
import Login from "./components/Login";

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <>
      {/* ✅ ToastContainerni App darajasiga qo‘shamiz */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {user && <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />}

      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <Tables />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu/:tableId"
          element={
            <PrivateRoute>
              <Menu setCart={setCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart/:tableId"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/menupage"
          element={
            <PrivateRoute>
              <MenuPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? "/tables" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;
