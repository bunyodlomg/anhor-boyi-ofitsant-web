import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, Clock, Check } from 'lucide-react';

export default function RestaurantAdmin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([
    { id: 1, name: 'Osh', price: 25000, category: 'Birinchi taomlar', available: true },
    { id: 2, name: 'Lagman', price: 28000, category: 'Birinchi taomlar', available: true },
    { id: 3, name: 'Somsa', price: 8000, category: 'Nonushta', available: true },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, table: '5', items: [{ name: 'Osh', qty: 2, price: 25000 }], status: 'pending', time: '14:30', total: 50000 },
    { id: 2, table: '3', items: [{ name: 'Lagman', qty: 1, price: 28000 }, { name: 'Somsa', qty: 3, price: 8000 }], status: 'preparing', time: '14:25', total: 52000 },
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });

  const handleAddProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name, price: Number(formData.price), category: formData.category }
          : p
      ));
    } else {
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        available: true
      };
      setProducts([...products, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, category: product.category });
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const formatPrice = (price) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Kutilmoqda',
      preparing: 'Tayyorlanmoqda',
      completed: 'Tayyor'
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🍽️ Oshxona Boshqaruv Paneli</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="inline-block w-5 h-5 mr-2" />
            Buyurtmalar
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Mahsulotlar
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="grid gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Stol #{order.table}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {order.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.name} x{item.qty}</span>
                      <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Jami: {formatPrice(order.total)}
                  </span>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleOrderStatus(order.id, 'preparing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Tayyorlashni boshlash
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Tayyor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Mahsulotlar ro'yxati</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: '', price: '', category: '' });
                  setShowProductModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yangi mahsulot
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nomi</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Kategoriya</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Narxi</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Holati</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-900">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.available ? 'Mavjud' : 'Tugagan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masalan: Osh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masalan: Birinchi taomlar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Narxi (so'm)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setFormData({ name: '', price: '', category: '' });
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProduct ? 'Saqlash' : 'Qo\'shish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
