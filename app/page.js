"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Home = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error);
            } else if (user) {
                console.log("User logged in:", user);
                setUser(user);
                fetchUserName(user.id);
            }
        };

        fetchUser();
    }, []);

    const fetchUserName = async (userId) => {
        try {
            console.log("Fetching user name for ID:", userId);

            const { data, error } = await supabase
                .from("users")
                .select("name")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching user name:", error);
            } else if (!data) {
                console.warn("User name not found in the database.");
            } else {
                setName(data.name);
                console.log("Fetched user name:", data.name);
            }
        } catch (err) {
            console.error("Unexpected error fetching user name:", err);
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error);
        } else {
            setUser(null);
            setName("");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
            <header className="flex justify-between items-center py-4">
                <h1 className="text-3xl font-bold">🍽️ Welcome to Our Food Ordering System</h1>
                <nav className="flex gap-4">
                    {user ? (
                        <>
                            <span className="text-lg font-semibold">Hello, {name || "User"} 👋</span>
                            <Link href="/orders" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">View Orders</Link>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Login</Link>
                            <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Sign Up</Link>
                        </>
                    )}
                </nav>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mt-10"
            >
                <h2 className="text-2xl font-semibold">Order Delicious Food in One Click!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Explore our menu and enjoy tasty meals at your convenience.
                </p>
                <Link href="/menu" className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg">
                    View Menu 🍕
                </Link>
            </motion.div>
        </div>
    );
};

export default Home;
