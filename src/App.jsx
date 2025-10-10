import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, Check, Clock, ChevronRight, AlertCircle } from 'lucide-react';

export default function TelegramWebApp() {

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // 🔥 Fullscreen ochish
      tg.ready();  // WebApp tayyorligini bildiradi
    }
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [view, setView] = useState('tables'); // 'tables', 'menu', 'activeOrders'
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 1,
      table: '3',
      items: [
        { id: 1, name: 'Whopper', price: 35000, quantity: 2, image: '🍔' },
        { id: 6, name: 'Coca Cola 0.5L', price: 8000, quantity: 2, image: '🥤' }
      ],
      total: 86000,
      time: '14:30',
      status: 'preparing'
    },
    {
      id: 2,
      table: '7',
      items: [
        { id: 4, name: 'Whopper Kombo', price: 52000, quantity: 1, image: '🍟' }
      ],
      total: 52000,
      time: '14:45',
      status: 'preparing'
    }
  ]);

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

  const tables = [
    { number: '1', status: 'free' },
    { number: '2', status: 'free' },
    { number: '3', status: 'occupied' },
    { number: '4', status: 'free' },
    { number: '5', status: 'free' },
    { number: '6', status: 'free' },
    { number: '7', status: 'occupied' },
    { number: '8', status: 'free' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectTable = (table) => {
    setSelectedTable(table);
    setTableNumber(table.number);

    // Agar stol band bo'lsa, mavjud buyurtmani yuklash
    if (table.status === 'occupied') {
      const existingOrder = activeOrders.find(order => order.table === table.number);
      if (existingOrder) {
        setCart(existingOrder.items);
      }
    } else {
      setCart([]);
    }

    setView('menu');
  };

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
    if (cart.length === 0) {
      alert('Savatchangiz bo\'sh!');
      return;
    }

    // Yangi buyurtma yoki qo'shimcha buyurtma
    const existingOrderIndex = activeOrders.findIndex(order => order.table === tableNumber);

    if (existingOrderIndex !== -1) {
      // Mavjud buyurtmaga qo'shish
      const updatedOrders = [...activeOrders];
      updatedOrders[existingOrderIndex] = {
        ...updatedOrders[existingOrderIndex],
        items: cart,
        total: getTotalPrice(),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      };
      setActiveOrders(updatedOrders);
    } else {
      // Yangi buyurtma
      const newOrder = {
        id: Date.now(),
        table: tableNumber,
        items: cart,
        total: getTotalPrice(),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        status: 'preparing'
      };
      setActiveOrders([...activeOrders, newOrder]);
    }

    console.log('Buyurtma yuborildi:', {
      table: tableNumber,
      items: cart,
      total: getTotalPrice(),
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowCart(false);
      setView('tables');
      setSelectedTable(null);
    }, 2000);
  };

  const getTableStatus = (tableNumber) => {
    return activeOrders.some(order => order.table === tableNumber) ? 'occupied' : 'free';
  };

  // Tables View
  if (view === 'tables') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
          <h1 className="text-2xl font-bold mb-1">🍔 Burger King</h1>
          <p className="text-sm text-red-100">Stolni tanlang</p>
        </div>

        <div className="p-4">
          {/* Active Orders Button */}
          {activeOrders.length > 0 && (
            <button
              onClick={() => setView('activeOrders')}
              className="w-full bg-blue-600 text-white p-4 rounded-xl mb-4 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Faol buyurtmalar</div>
                  <div className="text-sm text-blue-100">{activeOrders.length} ta stol</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Tables Grid */}
          <div className="grid grid-cols-3 gap-4">
            {tables.map(table => {
              const status = getTableStatus(table.number);
              const order = activeOrders.find(o => o.table === table.number);

              return (
                <button
                  key={table.number}
                  onClick={() => selectTable({ ...table, status })}
                  className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg transition-all ${status === 'occupied'
                    ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-900 hover:shadow-xl'
                    }`}
                >
                  <span className="text-3xl mb-2">
                    {status === 'occupied' ? '🔴' : '🟢'}
                  </span>
                  <span className="text-2xl font-bold mb-1">#{table.number}</span>
                  <span className="text-xs">
                    {status === 'occupied' ? 'Band' : 'Bo\'sh'}
                  </span>
                  {order && (
                    <div className="text-xs mt-2 bg-white bg-opacity-20 px-2 py-1 rounded">
                      {formatPrice(order.total)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Orders View
  if (view === 'activeOrders') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
          <button
            onClick={() => setView('tables')}
            className="text-white mb-2 flex items-center"
          >
            ← Orqaga
          </button>
          <h1 className="text-2xl font-bold mb-1">Faol buyurtmalar</h1>
          <p className="text-sm text-red-100">{activeOrders.length} ta stol</p>
        </div>

        <div className="p-4 space-y-4">
          {activeOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Stol #{order.table}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {order.time}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Tayyorlanmoqda
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span className="text-2xl">{item.image}</span>
                    <span className="flex-1">{item.name}</span>
                    <span className="text-gray-600">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(order.total)}
                </span>
                <button
                  onClick={() => selectTable({ number: order.table, status: 'occupied' })}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  Qo'shish
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Menu View
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <button
                onClick={() => {
                  setView('tables');
                  setCart([]);
                  setSelectedTable(null);
                }}
                className="text-white mb-2 flex items-center text-sm"
              >
                ← Orqaga
              </button>
              <h1 className="text-2xl font-bold">Stol #{tableNumber}</h1>
              <p className="text-sm text-red-100">
                {selectedTable?.status === 'occupied' ? '🔴 Mavjud buyurtmaga qo\'shish' : '🟢 Yangi buyurtma'}
              </p>
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

          {/* Warning for existing order */}
          {selectedTable?.status === 'occupied' && (
            <div className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded-lg flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Bu stolda buyurtma mavjud. Yangi mahsulotlar qo'shiladi.
              </span>
            </div>
          )}

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
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === category.id
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
              <div>
                <h2 className="text-xl font-bold">Stol #{tableNumber}</h2>
                <p className="text-sm text-red-100">({getTotalItems()} mahsulot)</p>
              </div>
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
                <div className="flex items-center justify-between text-lg font-bold mb-2">
                  <span>Jami:</span>
                  <span className="text-red-600 text-2xl">{formatPrice(getTotalPrice())}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {selectedTable?.status === 'occupied' ? 'Qo\'shimcha buyurtma berish' : 'Buyurtma berish'}
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
            <p className="text-gray-600">Stol #{tableNumber}</p>
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