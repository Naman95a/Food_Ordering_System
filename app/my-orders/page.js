"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchOrders();
    checkAdminStatus();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data);
    }
  };

  const checkAdminStatus = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error fetching user data:", userError);
      return;
    }

    const { data: userInfo, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (roleError) {
      console.error("Error fetching user role:", roleError);
    } else if (!userInfo) {
      console.warn("User not found in users table.");
    } else {
      setIsAdmin(userInfo.role === "admin");
      setUser(userData.user);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const allowedStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(newStatus)) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchError || !existingOrder || existingOrder.status !== "Pending") return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "Cancelled" })
      .eq("id", orderId);

    if (!error) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            let parsedItems = [];
            try {
              parsedItems = JSON.parse(order.items);
            } catch (error) {
              console.error("Error parsing items JSON:", error);
            }

            let totalPrice = order.total || parsedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return (
              <div key={order.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <p className="text-lg"><strong>Order ID:</strong> {order.id}</p>
                <p className="text-gray-400"><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>

                <p className="mt-3"><strong>Items:</strong></p>
                <ul className="list-disc pl-5">
                  {parsedItems.map((item, index) => (
                    <li key={index} className="text-gray-300">
                      {item.name} x{item.quantity} - <span className="text-green-400">₹{item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-lg"><strong>Total:</strong> <span className="text-green-400">₹{totalPrice.toFixed(2)}</span></p>
                <p className="mt-2"><strong>Status:</strong> <span className={`px-2 py-1 rounded ${order.status === "Pending" ? "bg-yellow-500 text-black" : order.status === "Delivered" ? "bg-green-500 text-black" : order.status === "Cancelled" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>{order.status}</span></p>

                {isAdmin && (
                  <div className="mt-4">
                    <label className="block text-gray-300 mb-1">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={order.status === "Delivered" || order.status === "Cancelled"}
                      className="bg-gray-700 text-white p-2 rounded-lg w-full"
                    >
                      {["Pending", "Preparing", "Out for Delivery", "Delivered"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

{!isAdmin && order.status === "Pending" && (
  <button
    onClick={() => cancelOrder(order.id)}
    className="mt-4 bg-red-600 text-white px-3 py-1 rounded-lg w-40 hover:bg-red-700 transition"
  >
    Cancel Order


                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
