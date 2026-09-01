import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecom_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ecom_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('ecom_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ecom_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ecom_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('ecom_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('ecom_coupon');
    }
  }, [coupon]);

  // Cart Operations
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((item) => item.product === product._id);
      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      if (existItem) {
        return prevItems.map((item) =>
          item.product === product._id
            ? { ...item, qty: Math.min(item.qty + qty, product.stock || 99) }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.images && product.images[0] ? product.images[0] : '',
            price: effectivePrice,
            regularPrice: product.price,
            stock: product.stock,
            category: product.category,
            qty: Math.min(qty, product.stock || 99),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId
          ? { ...item, qty: Math.min(qty, item.stock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  // Coupon Engine
  const applyCoupon = async (code) => {
    try {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const res = await apiRequest('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, orderAmount: subtotal }),
      });

      if (res.success) {
        setCoupon(res.coupon);
        return { success: true, coupon: res.coupon };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Pricing calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice >= 999 || itemsPrice === 0 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST

  let discountAmount = 0;
  if (coupon && coupon.discountPercent) {
    const rawDiscount = (itemsPrice * coupon.discountPercent) / 100;
    discountAmount = Math.min(rawDiscount, coupon.discountAmount || rawDiscount);
  }

  const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupon,
        applyCoupon,
        removeCoupon,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
