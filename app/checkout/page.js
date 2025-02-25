"use client"; // Required for client-side rendering

import { useCart } from "../../context/cartContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setErrorMessage("Your cart is empty. Add items before proceeding.");
            return;
        }

        const orderDetails = cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        setLoading(true);
        setErrorMessage("");

        try {
            const { error } = await supabase
                .from("orders")
                .insert([
                    {
                        items: JSON.stringify(orderDetails),
                        total_price: totalPrice,
                        status: "Pending",
                    },
                ]);

            if (error) {
                throw error;
            }

            console.log("Order placed successfully!");
            clearCart();
            router.push("/order-success");

        } catch (err) {
            console.error("Error placing order:", err.message);
            setErrorMessage("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6 relative">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>

            {/* Buttons aligned in top right */}
            <div className="absolute top-4 right-4 flex space-x-3">
                <button
                    onClick={clearCart}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                >
                    Clear Cart
                </button>

                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                    {loading ? "Processing..." : "Place Order"}
                </button>
            </div>

            {cart.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 mt-8">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="space-y-4 mt-8">
                        {cart.map((item) => (
                            <li key={item.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
                                {item.name} - {item.quantity} x ${item.price}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-4 text-lg font-semibold">
                        <strong>Total:</strong> ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </p>

                    {errorMessage && (
                        <p className="mt-2 text-red-500">{errorMessage}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CheckoutPage;
