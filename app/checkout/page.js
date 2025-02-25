"use client"; // Required for client-side rendering

import { useCart } from "../../context/cartContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        paymentMethod: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setErrorMessage("🛒 Your cart is empty. Add items before proceeding.");
            return;
        }
        if (!formData.name || !formData.address || !formData.paymentMethod) {
            setErrorMessage("⚠️ Please fill in all required fields.");
            return;
        }
        confirmOrder();
    };

    const confirmOrder = async () => {
        setLoading(true);
        setErrorMessage("");

        const orderDetails = cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        try {
            const { error } = await supabase
                .from("orders")
                .insert([
                    {
                        items: JSON.stringify(orderDetails),
                        total_price: totalPrice,
                        status: "Pending",
                        customer_name: formData.name,
                        customer_address: formData.address,
                        payment_method: formData.paymentMethod,
                    },
                ]);

            if (error) {
                throw error;
            }

            clearCart();
            router.push("/order-success");
        } catch (err) {
            console.error("Error placing order:", err.message);
            setErrorMessage("❌ Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6 relative">
            <h1 className="text-3xl font-bold mb-4 flex items-center">🛍️ Checkout</h1>

            {/* Navigation Buttons */}
            <div className="flex justify-between mb-4">
                <button onClick={() => router.push("/menu")} className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Menu
                </button>
                <button onClick={() => router.push("/cart")} className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded flex items-center">
                    <FaShoppingCart className="mr-2" /> View Cart
                </button>
            </div>

            {cart.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 mt-8">Your cart is empty.</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-2">📦 Order Summary</h2>
                    <ul className="space-y-4 mt-4">
                        {cart.map((item) => (
                            <li key={item.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
                                {item.name} - {item.quantity} x ${item.price}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-4 text-lg font-semibold">
                        <strong>Total:</strong> ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </p>

                    {/* Checkout Form */}
                    <h2 className="text-xl font-semibold mt-6">📝 Enter Your Details</h2>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center border p-3 rounded">
                            <FaUser className="mr-2" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="w-full bg-transparent focus:outline-none"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex items-center border p-3 rounded">
                            <FaMapMarkerAlt className="mr-2" />
                            <input
                                type="text"
                                name="address"
                                placeholder="Delivery Address"
                                className="w-full bg-transparent focus:outline-none"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex items-center border p-3 rounded relative">
                            <FaCreditCard className="mr-2" />
                            <select
                                name="paymentMethod"
                                className="w-full bg-transparent focus:outline-none appearance-none cursor-pointer"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Credit Card">💳 Credit Card</option>
                                <option value="PayPal">💰 PayPal</option>
                                <option value="Cash on Delivery">🚚 Cash on Delivery</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={clearCart}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
                        >
                            🗑️ Clear Cart
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                        >
                            {loading ? "Processing..." : "✅ Place Order"}
                        </button>
                    </div>
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                </>
            )}
        </div>
    );
};

export default CheckoutPage;
