"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "../../context/cartContext";
import Link from "next/link";
import { FaShoppingCart, FaPlus, FaMoneyBillAlt } from "react-icons/fa";

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data, error } = await supabase.from("menu_items").select("*");

                if (error) {
                    console.error("Error fetching menu:", error.message, error.details);
                } else {
                    setMenu(data);
                    console.log("Fetched menu items:", data);
                }
            } catch (err) {
                console.error("Unexpected error fetching menu:", err);
            }
        };

        fetchMenu();
    }, []);

    return (
        <div className="bg-gradient-to-br from-yellow-100 to-red-200 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white min-h-screen p-8">
            {/* Header with View Cart Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-red-600 dark:text-yellow-400 flex items-center">
                    🍽️ Explore Our Menu
                </h1>
                <Link href="/cart">
                    <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md">
                        <FaShoppingCart /> View Cart
                    </button>
                </Link>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <FaMoneyBillAlt className="text-yellow-500" /> Price: ${item.price}
                        </p>
                        <button
                            onClick={() => {
                                console.log("Clicked add to cart for:", item);
                                addToCart(item);
                            }}
                            className="mt-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                        >
                            <FaPlus /> Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
