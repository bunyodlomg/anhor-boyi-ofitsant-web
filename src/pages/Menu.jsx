import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";

export default function Menu() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // faqat shu stol uchun cart

    useEffect(() => {
        axios.get("http://localhost:5000/api/products").then((res) => {
            setProducts(res.data);
        });
    }, []);

    const addToCart = (product) => {
        setCart((prev) => {
            const exist = prev.find((p) => p._id === product._id);
            if (exist) {
                return prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (product) => {
        setCart((prev) => {
            const exist = prev.find((p) => p._id === product._id);
            if (!exist) return prev;
            if (exist.quantity === 1) {
                return prev.filter((p) => p._id !== product._id);
            } else {
                return prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: p.quantity - 1 } : p
                );
            }
        });
    };

    // Stol bo'shmi?
    const isEmpty = cart.length === 0;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-5xl font-bold flex items-center">#{tableId}</h1>
                <button
                    onClick={() => navigate(`/cart/${tableId}`, { state: { cart } })}
                    className="bg-orange-400 text-black text-xl font-bold px-6 py-3 rounded-full shadow-lg"
                >
                    🛒{cart.reduce((sum, item) => sum + item.quantity, 0)}
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((p) => {
                    const cartItem = cart.find((c) => c._id === p._id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                        <ProductCard
                            key={p._id}
                            product={p}
                            quantity={quantity}
                            showCounter={true}
                            onAdd={() => addToCart(p)}
                            onRemove={() => removeFromCart(p)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
