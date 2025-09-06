"use client";
import { createContext, useContext, useState, useEffect } from "react";


const CartContext = createContext();


export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item._id === product._id);
            if (existing) {
                
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };


    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((p) => p._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCart((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
        
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
