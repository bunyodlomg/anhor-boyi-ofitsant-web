import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ cartCount = 0 }) {
    const navigate = useNavigate();

    // Faol link uchun Tailwind class
    const activeClass = "bg-yellow-500 text-green-900 rounded px-2 py-1";

    return (
        <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            {/* Logo / Nomi */}
            <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/tables")}>
                🍽 Anhor Boyi
            </div>

            {/* Menu */}
            <div className="flex space-x-4 items-center text-xl">
                <NavLink
                    to="/tables"
                    className={({ isActive }) =>
                        isActive
                            ? activeClass
                            : "hover:bg-amber-400 hover:text-green-900 px-2 py-1 rounded transition"
                    }
                >
                    Stol
                </NavLink>

                <NavLink
                    to="/menupage"
                    className={({ isActive }) =>
                isActive
                ? activeClass
                : "hover:bg-amber-400 hover:text-green-900 px-2 py-1 rounded transition"
                    }
                >
                Menyu
            </NavLink>
        </div>
        </nav >
    );
}
