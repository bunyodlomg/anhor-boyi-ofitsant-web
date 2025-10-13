import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Buyurtma va stol statusi API uchun
import { Utensils } from "lucide-react";

export default function Tables() {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);

    useEffect(() => {
        // API dan stollar va ularning statusini olish
        const fetchTables = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/tables"); // backend route
                setTables(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTables();
    }, []);

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-6"><Utensils /> Stolni tanlang</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tables.map((table) => (
                    <button
                        key={table._id}
                        onClick={() => navigate(`/menu/${table.number}`)}
                        className={`text-white font-semibold py-4 rounded-xl shadow-md transition
              ${table.isOccupied === false
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 cursor-not-allowed opacity-70"
                            }`}>
                        Stol {table.number}
                    </button>
                ))}
            </div>
        </div>
    );
}
