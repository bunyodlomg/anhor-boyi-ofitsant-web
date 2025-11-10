import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
const apiUrl = import.meta.env.VITE_API_URL;

export default function MenuPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [category, setCategory] = useState("all"); // default: barcha

    useEffect(() => {
        axios.get(`${apiUrl}/api/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, []);

    // const handleAdd = (product) => {
    //     setCart(prev => ({
    //         ...prev,
    //         [product._id]: prev[product._id] ? prev[product._id] + 1 : 1
    //     }));
    // };

    // const handleRemove = (product) => {
    //     setCart(prev => {
    //         if (!prev[product._id]) return prev;
    //         const updated = { ...prev };
    //         updated[product._id]--;
    //         if (updated[product._id] === 0) delete updated[product._id];
    //         return updated;
    //     });
    // };

    // Filtrlash
    const filteredProducts = category === "all"
        ? products
        : products.filter(p => p.category === category);

    return (
        <div className="p-6">
            {/* Category filter */}
            <div className="flex space-x-4 mb-4 overflow-x-scroll">
                {["all", "Taomlar", "Kaboblar", "Salat", "Ichimlik", "Desertlar"].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded ${category === cat ? "bg-green-700 text-white" : "bg-green-300 text-black"
                            }`}
                    >
                        {cat === "all" ? "Barchasi" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Mahsulotlar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        showCounter={false}
                    />
                ))}
            </div>
        </div>
    );
}
