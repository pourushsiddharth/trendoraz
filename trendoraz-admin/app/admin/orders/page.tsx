"use client";

import { useEffect, useState, useCallback } from "react";
import { updateOrderStatus } from "@/app/actions/orders";

interface Order {
  id: number;
  user_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<{ order: Order; items: OrderItem[] } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast("Order status updated");
    } catch (err) {
      showToast("Update failed");
    }
  };

  const viewOrderDetails = async (order: Order) => {
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      const items = await res.json();
      setSelectedOrder({ order, items });
      setIsModalOpen(true);
    } catch (err) {
      showToast("Failed to load details");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-6 h-6 text-[#d4a853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2" strokeLinecap="round"/>
            </svg>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-white/30">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-6 py-4 font-medium">Order ID</th>
                <th className="text-left px-6 py-4 font-medium">Customer</th>
                <th className="text-left px-6 py-4 font-medium">Amount</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">#{o.id}</td>
                  <td className="px-6 py-4 text-white/60">{o.user_email}</td>
                  <td className="px-6 py-4 text-[#d4a853] font-semibold">₹{o.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-white/40">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={o.status} 
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      className="bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#d4a853]"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => viewOrderDetails(o)}
                      className="text-xs text-white/40 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-xl">Order #{selectedOrder.order.id}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-black/30 rounded-xl border border-white/5">
              <div>
                <p className="text-white/30 text-xs uppercase mb-1">Customer</p>
                <p className="text-white font-medium">{selectedOrder.order.user_email}</p>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase mb-1">Total Amount</p>
                <p className="text-[#d4a853] font-bold">₹{selectedOrder.order.total_amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/30 text-xs uppercase font-medium">Items Ordered</p>
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.02] text-white/30 text-xs">
                    <tr>
                      <th className="text-left px-4 py-3">Product</th>
                      <th className="text-center px-4 py-3">Qty</th>
                      <th className="text-right px-4 py-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="px-4 py-3 text-white">{item.product_name || `Product ID: ${item.product_id}`}</td>
                        <td className="px-4 py-3 text-center text-white/60">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-white/60">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1e1e1e] border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#d4a853] shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
