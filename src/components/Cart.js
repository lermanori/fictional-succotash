// src/components/Cart.js

import React from 'react';

const Cart = ({ cartItems, onCheckout, onClearCart, onRemoveItem }) => {
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.title} - ${item.price} x {item.quantity} (Total: ${(item.price * item.quantity).toFixed(2)})
                <button className="remove-item" onClick={() => onRemoveItem(item.id)}>X</button> {/* "X" button to remove individual item */}
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <button className="checkout-button" onClick={onCheckout}>
              Checkout
            </button>
            <button className="clear-cart-button" onClick={onClearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
