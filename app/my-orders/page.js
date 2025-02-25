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

  // Fetch Orders
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

  // Check if User is Admin
  const checkAdminStatus = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error fetching user data:", userError);
      return;
    }

    console.log("User Data:", userData.user);

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
      console.log("User Role Data:", userInfo);
      setIsAdmin(userInfo.role === "admin");
      setUser(userData.user);
    }
  };

  // Update Order Status (Admin)
  const updateStatus = async (orderId, newStatus) => {
    const allowedStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(newStatus)) {
      console.error(`Invalid status: ${newStatus}`);
      return;
    }

    console.log(`Updating order ${orderId} to status: ${newStatus}`);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  // Cancel Order (User)
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    console.log(`Attempting to cancel order: ${orderId}`);

    // Ensure the order exists before updating
    const { data: existingOrder, error: fetchError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .maybeSingle();

    if (fetchError) {
        console.error("Error fetching order before cancellation:", fetchError);
        return;
    }

    if (!existingOrder) {
        console.error("Order not found.");
        return;
    }

    if (existingOrder.status !== "Pending") {
        console.warn("Order cannot be canceled as it is not in 'Pending' status.");
        return;
    }

    // Proceed with cancellation
    const { error } = await supabase
        .from("orders")
        .update({ status: "Cancelled" })
        .eq("id", orderId);

    if (error) {
        console.error("Error canceling order:", error);
    } else {
        console.log(`Order ${orderId} successfully canceled.`);
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: "Cancelled" } : order
            )
        );
    }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          let parsedItems = [];
          try {
            parsedItems = JSON.parse(order.items);
          } catch (error) {
            console.error("Error parsing items JSON:", error);
          }

          let totalPrice = order.total || parsedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return (
            <div key={order.id} className="border p-4 mb-4 rounded-lg">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <p><strong>Items:</strong></p>
              <ul>
                {parsedItems.map((item, index) => (
                  <li key={index}>{item.name} x{item.quantity} - ${item.price.toFixed(2)}</li>
                ))}
              </ul>

              <p><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>

              {/* Admin Status Dropdown */}
              {isAdmin && (
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={order.status === "Delivered" || order.status === "Cancelled"} // Disable for completed orders
                  className="border p-2 rounded-lg"
                >
                  {["Pending", "Preparing", "Out for Delivery", "Delivered"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}

              {/* Cancel Button (Users can cancel only "Pending" orders) */}
              {!isAdmin && order.status === "Pending" && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrdersPage;
