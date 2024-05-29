import { useState, useEffect } from 'react'
import { db } from '../data/db'
import { useMemo } from 'react'

export const useCart = () => {

    
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    // State
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEM = 5

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)
        if (itemExists >= 0) { // Existe en elc arrito
        const updateCart = [...cart]
        updateCart[itemExists].quantity++
        setCart(updateCart)
        } else {
        item.quantity = 1
        setCart([...cart, item])
        }


    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
        if (item.id === id && item.quantity < MAX_ITEM) {
            return {
            ...item,
            quantity: item.quantity + 1
            }
        }
        return item
        })
        setCart(updateCart)
    }

    function decrementQuantity(id) {
        const updateCart = cart.map(item => {
        if (item.id === id && item.quantity > 1) {
            return {
            ...item,
            quantity: item.quantity - 1
            }
        }
        return item
        })
        setCart(updateCart)
    }

    function clearCart(e) {
        setCart([])
    }

    // State Derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data, 
        cart,
        addToCart,
        removeFromCart,
        decrementQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

