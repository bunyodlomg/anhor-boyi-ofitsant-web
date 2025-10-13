import React from "react";

export default function ProductCard({ product, onAdd }) {
    return (
        <div className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center text-center">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.price} so‘m</p>
            <button
                onClick={onAdd}
                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
            >
                Qo‘shish
            </button>
        </div>
    );
}
