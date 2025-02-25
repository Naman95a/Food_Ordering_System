"use client";
import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage when the component mounts
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        console.log("Adding to cart:", item);
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };
    
    const clearCart = () => {
        console.log("Cart cleared!");
        setCart([]);
    };

    const updateQuantity = (id, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item
            )
        );
    };
    

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity ,clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
