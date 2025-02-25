"use client";
import { useCart } from "../../context/cartContext";
import Link from "next/link";

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();

    console.log("Cart items in CartPage:", cart);

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6 relative">
            {/* "Back to Menu" button aligned to the top right */}
            <div className="absolute top-4 right-4">
                <Link href="/menu">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm">
                        Back to Menu
                    </button>
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
            
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="space-y-4">
                    {cart.map((item) => (
                        <li key={item.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300">Price: ${item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {cart.length > 0 && (
                <div className="mt-6 flex gap-4">
                    <button 
                        onClick={clearCart} 
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded"
                    >
                        Clear Cart
                    </button>
                    <Link href="/checkout">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;
