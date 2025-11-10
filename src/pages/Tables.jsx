import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io(apiUrl, { transports: ["websocket"], reconnection: true });

export default function Tables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [activeCategory, setActiveCategory] = useState("zal"); // 🟢 hozirgi slayd

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/tables`);
        setTables(res.data);
      } catch (err) {
        console.error("❌ Stol ma'lumotlarini olishda xatolik:", err);
      }
    };

    fetchTables();

    // 🔄 Socket hodisalar
    socket.on("connect", () => console.log("✅ Socket ulandi:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket uzildi"));
    socket.on("tableUpdated", (updated) =>
      setTables((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    );
    socket.on("tableCreated", (newTable) =>
      setTables((prev) => [...prev, newTable])
    );
    socket.on("tableDeleted", (deletedId) =>
      setTables((prev) => prev.filter((t) => t._id !== deletedId))
    );
    socket.on("orderClosed", fetchTables);

    return () => socket.removeAllListeners();
  }, []);

  const handleClick = async (table) => {
    try {
      if (table.status === "empty") {
        navigate(`/menu/${table._id}`, { state: { number: table.number, category: table.category } });
        return;
      }

      const res = await axios.get(`${apiUrl}/api/orders/pending`, {
        params: { number: table.number, category: table.category },
      });

      const existingOrder = res.data;

      if (existingOrder && existingOrder.items?.length > 0) {
        navigate(`/menu/${table._id}`, {
          state: { number: table.number, category: table.category, existingOrder },
        });
      } else {
        alert("❌ Bu stol band, ammo aktiv buyurtma topilmadi.");
      }
    } catch (err) {
      console.error("❌ Buyurtmani tekshirishda xatolik:", err);
      alert("Server bilan bog'lanishda xatolik yuz berdi.");
    }
  };

  const groupedTables = {
    zal: tables.filter((t) => t.category === "zal"),
    xona: tables.filter((t) => t.category === "xona"),
    "ko'cha": tables.filter((t) => t.category === "ko'cha"),
  };

  const categories = ["zal", "xona", "ko'cha"];

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Stolni tanlang</h1>

      {/* 🟢 Slider tugmalari */}
      <div className="flex justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeCategory === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🟢 Slider kontent */}
      <div className="relative">
        {categories.map((category, i) => (
          <div
            key={category}
            className={`transition-all duration-500 ${
              activeCategory === category ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
            }`}
          >
            {groupedTables[category].length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {groupedTables[category].map((table) => (
                  <button
                    key={table._id}
                    onClick={() => handleClick(table)}
                    className={`h-28 text-5xl text-white font-extrabold rounded-xl shadow-md transition
                      ${table.status === "empty"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                  >
                    {category === "xona" ? "🚪" : category === "zal" ? "🪑" : "🌳"} {table.number}
                    <p className="text-sm mt-1 font-medium">
                      {table.status === "busy" ? "Band" : "Bo'sh"}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Bu kategoriyada stol yo‘q</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
