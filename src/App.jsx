// App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import MenuPage from "./pages/Menus";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <>
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      <Routes>
        {/* Dastur ochilganda avtomatik /tables sahifasiga yo‘naltiradi */}
        <Route path="/" element={<Navigate to="/tables" replace />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/menu/:tableId" element={<Menu setCart={setCart} />} />
        <Route path="/cart/:tableId" element={<Cart />} />
        <Route path="/menupage" element={<MenuPage />} />
      </Routes>
    </>
  );
}

export default App;
