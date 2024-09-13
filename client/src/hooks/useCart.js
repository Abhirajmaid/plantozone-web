"use client"
import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

function useCart() {
    const [cart, setCart] = useLocalStorage('cart', []);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);

    return { cart, addToCart, removeFromCart, clearCart, cartTotal };
}

export default useCart;
