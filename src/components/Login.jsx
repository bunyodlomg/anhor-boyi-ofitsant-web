import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
            localStorage.setItem("user", JSON.stringify(res.data));
            onLoginSuccess(res.data);
            toast.success("Muvaffaqiyatli login qilindi ✅");
        } catch (err) {
            const msg = err.response?.data?.message || "Login xatosi!";
            toast.error(msg);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-80 space-y-3"
            >
                <h2 className="text-xl font-bold text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded p-2"
                />
                <input
                    type="password"
                    placeholder="Parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded p-2"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Kirish
                </button>
            </form>
        </div>
    );
}
