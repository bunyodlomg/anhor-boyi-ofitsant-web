import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Cart() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const tableNumber = state?.tableNumber;
  const tableCategory = state?.tableCategory; // 🔹 category qo'shildi
  const [cart] = useState(state?.cart || []);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + serviceFee;

  const handleOrder = async () => {
    if (!tableNumber || !tableCategory) {
      alert("❌ Stol raqami yoki kategoriya mavjud emas!");
      return;
    }

    if (cart.length === 0) {
      alert("⚠️ Savat bo'sh!");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Avval pending orderni tekshiramiz
      let existingOrder = null;
      try {
        const res = await axios.get(`${apiUrl}/api/orders/pending`, {
          params: { number: tableNumber, category: tableCategory },
        });
        existingOrder = res.data;
      } catch (err) {
        if (err.response?.status !== 404) throw err;
      }

      // 🔹 items formatini backendga moslab yuboramiz
      const formattedItems = cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));

      if (existingOrder && existingOrder._id) {
        // 🔹 existing order bo‘lsa update qilamiz
        await axios.put(`${apiUrl}/api/orders/pending`, {
          tableNumber,
          category: tableCategory,
          items: formattedItems,
        });
        alert("🟡 Buyurtma yangilandi!");
      } else {
        // 🔹 yangi order yaratish
        await axios.post(`${apiUrl}/api/orders`, {
          tableNumber,
          category: tableCategory,
          items: formattedItems,
        });
        alert("✅ Buyurtma muvaffaqiyatli yuborildi!");
      }

      navigate("/tables");
    } catch (err) {
      console.error("Buyurtma yuborishda xato:", err);
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full min-h-screen bg-gray-50">
      <div className="p-6 w-[80%] mx-auto bg-white shadow-2xl rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">🪑#{tableNumber}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl font-bold text-gray-400">Savat bo'sh</p>
            <button onClick={() => navigate("/tables")} className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Ortga qaytish
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-3 mb-6">
              {cart.map((item, i) => (
                <li key={i} className="flex justify-between items-center border-b pb-2 text-lg">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-2 text-red-500 font-bold">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} so'm</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-lg">
                <span>Xizmat haqi:</span>
                <span>{serviceFee.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between font-bold text-2xl border-t pt-2">
                <span>Jami:</span>
                <span className="text-green-600">{total.toLocaleString()} so'm</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold text-lg transition"
            >
              {loading ? "Yuborilmoqda..." : "Tasdiqlash ✅"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="mt-3 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
            >
              Ortga
            </button>
          </>
        )}
      </div>
    </div>
  );
}
