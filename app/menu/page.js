"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "../../context/cartContext";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaPlus, FaMoneyBillAlt, FaSearch, FaFilter, FaTimes, FaMinus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gsap from "gsap";

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const menuRef = useRef(null);
    const customLoader = ({ src }) => {
        return src; // Allows any external image URL
      };
      

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

    useEffect(() => {
        gsap.fromTo(
            menuRef.current.children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 }
        );
    }, [menu]);

    const handleAddToCart = (item) => {
        addToCart(item);
        toast.success(`${item.name} added to cart!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    };

    const filteredMenu = menu.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === "All" || item.category === filter)
        );
    });

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6 relative">
            <ToastContainer />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">🍽️ Explore Our Menu</h1>
                <button 
                    onClick={() => setIsCartOpen(true)} 
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-sm shadow-lg">
                    <FaShoppingCart /> View Cart
                </button>
            </div>

            {/* Search Bar & Filter */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 w-full md:w-1/3">
                    <FaSearch className="text-gray-600 dark:text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search for food..."
                        className="bg-transparent outline-none ml-2 w-full text-black dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Veg", "Non-Veg", "Drinks"].map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-lg text-sm ${filter === category ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"}`}
                            onClick={() => setFilter(category)}
                        >
                            <FaFilter /> {category}
                        </button>
                    ))}
                </div>
            </div>

           {/* Menu List */}
{/* Menu List */}
{/* Menu List */}
<ul ref={menuRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredMenu.map((item) => (
        <li key={item.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800 overflow-hidden">
            {/* Image with Increased Height */}
            <div className="w-full h-72">  {/* Increase height to h-72 or h-80 */}
                <Image
                    loader={customLoader}
                    src={item.imageUrl}
                    alt={item.name}
                    width={300} 
                    height={288}  // Matches h-72 (72 * 4px = 288px)
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            {/* Content Below */}
            <div className="p-3">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <FaMoneyBillAlt /> Price: ₹{item.price}
                </p>
                <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                    <FaPlus /> Add to Cart
                </button>
            </div>
        </li>
    ))}
</ul>






            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed top-0 right-0 w-80 h-full bg-gray-100 dark:bg-gray-800 shadow-lg p-4 z-50 flex flex-col">
                    <button 
                        onClick={() => setIsCartOpen(false)} 
                        className="self-end text-gray-700 dark:text-gray-300">
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-lg font-semibold mb-4">🛒 Your Cart</h2>
                    <ul className="flex-grow overflow-y-auto">
                        {cart.map((item) => (
                            <li key={item.id} className="flex justify-between items-center p-2 border-b border-gray-300 dark:border-gray-700">
                                <span>{item.name} x {item.quantity}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        if (item.quantity > 1) {
                                            updateQuantity(item.id, item.quantity - 1);
                                        } else {
                                            removeFromCart(item.id);
                                        }
                                    }} className="text-red-500">
                                        <FaMinus />
                                    </button>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-green-500">
                                        <FaPlus />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Total Price */}
                    <p className="font-semibold mt-4">Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
                    
                    {/* Checkout Button */}
                    {cart.length > 0 && (
                        <button 
                            onClick={() => {
                                toast.info("Redirecting to checkout...", { autoClose: 1500 });
                                setTimeout(() => {
                                    window.location.href = "/checkout";
                                }, 1500);
                            }} 
                            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md w-full text-center text-lg">
                            Proceed to Checkout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
