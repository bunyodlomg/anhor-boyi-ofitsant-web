import React from "react";
import { Routes, Route } from "react-router-dom";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Routes>
        <Route path="/" element={<Tables />} />
        <Route path="/menu/:tableId" element={<Menu />} />
        <Route path="/cart/:tableId" element={<Cart />} />
      </Routes>
    </div>
  );
}
