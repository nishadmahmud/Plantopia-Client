import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();
const LOCAL_STORAGE_CART_KEY = 'plantopia_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Load cart from local storage on initial mount
  useEffect(() => {
    const localCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if (localCart) {
      setCartItems(JSON.parse(localCart));
    }
    setLoading(false);
  }, []);

  // Sync cart with local storage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Handle cart synchronization when user logs in
  useEffect(() => {
    const syncCartWithDatabase = async () => {
      if (user?.uid) {
        try {
          // First, fetch the user's cart from database
          const response = await axios.get(`http://localhost:3000/api/cart/${user.uid}`);
          
          if (response.data.success) {
            const dbCart = response.data.data;
            const localCart = cartItems;

            // Merge local cart with database cart
            if (localCart.length > 0) {
              const mergedCart = mergeCartItems(localCart, dbCart);
              setCartItems(mergedCart);
              // Update database with merged cart
              await syncCart(mergedCart);
            } else if (dbCart.length > 0) {
              setCartItems(dbCart);
            }
          }
        } catch (error) {
          console.error('Error syncing cart with database:', error);
        }
      }
    };

    syncCartWithDatabase();
  }, [user]);

  // Helper function to merge cart items
  const mergeCartItems = (localCart, dbCart) => {
    const mergedCart = [...dbCart];
    
    localCart.forEach(localItem => {
      const existingItem = mergedCart.find(item => item._id === localItem._id);
      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        mergedCart.push(localItem);
      }
    });

    return mergedCart;
  };

  // Sync cart with database
  const syncCart = async (newCart) => {
    if (user?.uid) {
      try {
        await axios.put(`http://localhost:3000/api/cart/${user.uid}`, {
          cart: newCart
        });
      } catch (error) {
        console.error('Error syncing cart:', error);
        toast.error('Failed to update cart');
      }
    }
  };

  const addToCart = async (item, quantity = 1) => {
    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
    let newCart;

    if (existingItem) {
      newCart = cartItems.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
      toast.success(`Added ${quantity} more ${item.name} to cart`);
    } else {
      // Make sure we're including all necessary product details
      const cartItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
        quantity: quantity
      };
      newCart = [...cartItems, cartItem];
      toast.success(`${quantity} ${item.name} added to cart`);
    }

    setCartItems(newCart);
    if (user?.uid) {
      await syncCart(newCart);
    }
  };

  const removeFromCart = async (itemId) => {
    const itemToRemove = cartItems.find(item => item._id === itemId);
    const newCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(newCart);
    
    if (user?.uid) {
      await syncCart(newCart);
    }
    
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from cart`);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    const newCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    );
    setCartItems(newCart);
    
    if (user?.uid) {
      await syncCart(newCart);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    if (user?.uid) {
      await syncCart([]);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 