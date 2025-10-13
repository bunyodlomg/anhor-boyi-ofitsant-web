import React from "react";
import { useNavigate } from "react-router-dom";

export default function Tables() {
  const navigate = useNavigate();
  const tables = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">🍽 Stolni tanlang</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tables.map((num) => (
          <button
            key={num}
            onClick={() => navigate(`/menu/${num}`)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-md transition"
          >
            Stol {num}
          </button>
        ))}
      </div>
    </div>
  );
}
