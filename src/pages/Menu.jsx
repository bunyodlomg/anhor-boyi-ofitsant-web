import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Menu() {
  const { tableId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const tableNumber = state?.number;
  const tableCategory = state?.category;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Barcha mahsulotlar
        const prodRes = await axios.get(`${apiUrl}/api/products`);
        setProducts(prodRes.data);

        // Agar tableNumber va tableCategory mavjud bo‘lsa, pending orderni yuklaymiz
        if (tableNumber && tableCategory) {
          try {
            const orderRes = await axios.get(`${apiUrl}/api/orders/pending`, {
              params: { number: tableNumber, category: tableCategory },
            });

            const items = orderRes.data?.items || [];
            const formattedCart = items.map((i) => ({
              productId: i.product._id,
              name: i.product.name,
              price: Number(i.product.price),
              quantity: Number(i.quantity) || 1,
            }));

            setCart(formattedCart);
            console.log("✅ Mavjud order yuklandi:", formattedCart);
          } catch (err) {
            if (err.response?.status === 404) setCart([]);
            else {
              console.error("❌ Orderni yuklashda xatolik:", err);
              setCart([]);
            }
          }
        } else {
          setCart([]);
          console.error("❌ tableNumber yoki tableCategory topilmadi!");
        }
      } catch (err) {
        console.error("❌ Mahsulotlarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableNumber, tableCategory, navigate]);

  const updateCart = (productId, action) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);

      if (action === "add") {
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          const product = products.find((p) => p._id === productId);
          if (!product) return prev;
          return [
            ...prev,
            { productId, name: product.name, price: Number(product.price), quantity: 1 },
          ];
        }
      } else if (action === "remove") {
        if (!existing) return prev;
        if (existing.quantity === 1) return prev.filter((i) => i.productId !== productId);
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev;
    });
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => {
    if (cart.length === 0) {
      alert("⚠️ Savat bo'sh!");
      return;
    }
    navigate(`/cart/${tableId}`, { state: { cart, tableNumber, tableCategory } });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="text-2xl">Yuklanmoqda...</p></div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-5xl font-bold flex items-center">🪑 Stol #{tableNumber}</h1>
        <button
          onClick={openCart}
          className={`text-xl font-bold px-6 py-3 rounded-full shadow-lg transition ${cartItemCount > 0 ? "bg-orange-400 text-black hover:bg-orange-500" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          disabled={cartItemCount === 0}
        >
          🛒 {cartItemCount}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20"><p className="text-2xl text-gray-400">Mahsulotlar topilmadi</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((p) => {
            const cartItem = cart.find((c) => c.productId === p._id);
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <ProductCard
                key={p._id}
                product={{ ...p, productId: p._id }}
                quantity={quantity}
                showCounter
                onAdd={() => updateCart(p._id, "add")}
                onRemove={() => updateCart(p._id, "remove")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
