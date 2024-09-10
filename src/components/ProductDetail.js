// src/components/ProductDetail.js

import React, { useState } from 'react';

const ProductDetail = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1); // Quantity state

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-overlay" onClick={onClose}></div>
      <div className="product-detail">
        <button className="close-button" onClick={onClose}>×</button>
        <img src={product.image_link} alt={product.title} className="product-image" />
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
        <p className="product-condition">Condition: {product.condition}</p>
        <p className="product-availability">Availability: {product.availability}</p>
        <p className="product-gtin">GTIN: {product.gtin}</p>
        <p className="product-mpn">MPN: {product.mpn}</p>
        <p className="product-weight">Weight: {product.shipping_weight}</p>
        <p className="product-dimensions">
          Dimensions: {product.shipping_length} x {product.shipping_width} x {product.shipping_height}
        </p>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart" onClick={() => onAddToCart(product, quantity)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
