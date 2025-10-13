import React from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const { state } = useLocation();
  const { tableId } = useParams();
  const cart = state?.cart || [];

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = async () => {
    try {
      await axios.post("https://your-server.com/api/orders", {
        table: tableId,
        items: cart,
        total,
      });
      alert("✅ Buyurtma yuborildi!");
      window.Telegram?.WebApp?.close();
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🛒 Savatcha — Stol {tableId}</h1>
      {cart.length === 0 ? (
        <p>Savatcha bo‘sh</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>{item.name}</span>
                <span>{item.price} so‘m</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-semibold">
            <span>Jami:</span>
            <span>{total} so‘m</span>
          </div>
          <button
            onClick={handleOrder}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Buyurtma berish
          </button>
        </>
      )}
    </div>
  );
}
