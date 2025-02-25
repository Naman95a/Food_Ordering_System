"use client";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data, error } = await supabase.from("orders").select("*");
            if (error) console.error("Error fetching orders:", error);
            else setOrders(data);
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Your Orders</h2>
            {orders.length === 0 ? <p>No orders found.</p> : orders.map((order) => (
                <div key={order.id}>
                    <p>Order ID: {order.id}</p>
                    <p>Total Price: ${order.total_price}</p>
                    <p>Status: {order.status}</p>
                </div>
            ))}
        </div>
    );
};

export default OrdersPage;
