import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";

export default function Menu() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📋 Menyu — Stol {tableId}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />
        ))}
      </div>
      <button
        onClick={() => navigate(`/cart/${tableId}`, { state: { cart } })}
        className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg"
      >
        🛒 Savatcha ({cart.length})
      </button>
    </div>
  );
}
