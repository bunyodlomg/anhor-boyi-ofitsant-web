import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, Check } from 'lucide-react';

export default function TelegramWebApp() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'Hammasi', icon: '🍽️' },
    { id: 'burgers', name: 'Burgerlar', icon: '🍔' },
    { id: 'combo', name: 'Kombo', icon: '🍟' },
    { id: 'drinks', name: 'Ichimliklar', icon: '🥤' },
    { id: 'desserts', name: 'Desertlar', icon: '🍰' },
  ];

  const products = [
    { id: 1, name: 'Whopper', price: 35000, category: 'burgers', image: '🍔', description: 'Klassik Whopper burger' },
    { id: 2, name: 'Double Whopper', price: 45000, category: 'burgers', image: '🍔', description: 'Ikki qatlamli go\'sht' },
    { id: 3, name: 'Chicken Royale', price: 32000, category: 'burgers', image: '🍗', description: 'Tovuqli burger' },
    { id: 4, name: 'Whopper Kombo', price: 52000, category: 'combo', image: '🍟', description: 'Burger + fri + ichimlik' },
    { id: 5, name: 'King Kombo', price: 58000, category: 'combo', image: '🍟', description: 'Katta kombo set' },
    { id: 6, name: 'Coca Cola 0.5L', price: 8000, category: 'drinks', image: '🥤', description: 'Sovuq ichimlik' },
    { id: 7, name: 'Fanta 0.5L', price: 8000, category: 'drinks', image: '🥤', description: 'Apelsinli ichimlik' },
    { id: 8, name: 'Ayran', price: 7000, category: 'drinks', image: '🥛', description: 'Tabiiy ayran' },
    { id: 9, name: 'Muzqaymoq', price: 12000, category: 'desserts', image: '🍦', description: 'Shokoladli muzqaymoq' },
    { id: 10, name: 'Apple Pie', price: 10000, category: 'desserts', image: '🥧', description: 'Olma pirogi' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  const handleOrder = () => {
    if (!tableNumber.trim()) {
      alert('Iltimos, stol raqamini kiriting!');
      return;
    }
    if (cart.length === 0) {
      alert('Savatchangiz bo\'sh!');
      return;
    }

    // Bu yerda API ga yuboriladi
    console.log('Buyurtma:', {
      table: tableNumber,
      items: cart,
      total: getTotalPrice(),
      timestamp: new Date()
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
      setShowCart(false);
      setTableNumber('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">🍔 Burger King</h1>
              <p className="text-sm text-red-100">Tanlang va buyurtma bering</p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-white text-red-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto px-4 pb-3 hide-scrollbar">
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-white text-red-600 shadow-lg scale-105'
                    : 'bg-red-500 text-white hover:bg-red-400'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 flex items-center justify-center">
                <span className="text-6xl">{product.image}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-600">{formatPrice(product.price)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-2 rounded-full hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Savatcha ({getTotalItems()})</h2>
              <button
                onClick={() => setShowCart(false)}
                className="bg-white text-red-600 p-2 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🛒</span>
                  <p className="text-gray-500">Savatchangiz bo'sh</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                      <div className="bg-white rounded-lg p-3 text-3xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-red-600 font-medium">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Stol raqami (masalan: 5)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                />
                <div className="flex items-center justify-between text-lg font-bold mb-2">
                  <span>Jami:</span>
                  <span className="text-red-600 text-2xl">{formatPrice(getTotalPrice())}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Buyurtma berish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm animate-bounce-in">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Buyurtma qabul qilindi!</h3>
            <p className="text-gray-600">Tez orada tayyorlanadi</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}