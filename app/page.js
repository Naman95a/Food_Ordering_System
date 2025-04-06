"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import gsap from "gsap";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Home = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");

    useEffect(() => {
        gsap.from(".hero-text", { opacity: 0, y: 30, duration: 1, ease: "power3.out" });
        gsap.from(".hero-button", { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.5, ease: "back.out(1.7)" });
    }, []);

    const fetchUserName = async (userId) => {
        try {
            if (!userId) return;
            const { data, error } = await supabase
                .from("users")
                .select("name")
                .eq("id", userId)
                .single();
            if (!error && data?.name) setName(data.name);
        } catch (err) {
            console.error("Error fetching user name:", err);
        }
    };

    const fetchUser = async () => {
        const { data: userData, error } = await supabase.auth.getUser();
        if (userData?.user?.id) {
            setUser(userData.user);
            await addUserToDatabase(userData.user);
            fetchUserName(userData.user.id);
        }
    };

    const addUserToDatabase = async (user) => {
        if (!user?.id || !user?.email) return;
        await supabase.from("users").upsert([
            {
                id: user.id,
                name: user.user_metadata?.full_name || "New User",
                email: user.email,
            },
        ]);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setName("");
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white" style={{
            backgroundImage: "url('/00.png')",
            height: '100vh', // Example height for the background
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500"></div>

            <nav className="absolute top-5 w-full max-w-6xl flex justify-between items-center px-6 md:px-12 z-10">
                <h1 className="text-3xl font-extrabold drop-shadow-md">🍽️ Foodie Haven</h1>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-lg font-semibold">Hello, {name} 👋</span>
                            <Link href="/my-orders">
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md">
                                    <FaShoppingCart />
                                    Orders
                                </button>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md">
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg shadow-md">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg shadow-md">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <motion.div className="text-center px-6 md:px-12 z-10 hero-text">
                <h2 className="text-4xl md:text-6xl font-bold drop-shadow-md">
                    Order <span className="text-yellow-300">Delicious Food</span> in One Click!
                </h2>
                <p className="mt-4 text-lg md:text-xl text-gray-200">
                    Explore our menu and enjoy tasty meals at your convenience.
                </p>
                <Link href="/menu">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hero-button"
                    >
                        View Menu 🍕
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export default Home;
