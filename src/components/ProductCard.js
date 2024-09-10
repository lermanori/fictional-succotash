// src/components/ProductCard.js

import React from 'react';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <img src={product.image_link} alt={product.title} className="product-image" />
      <div className="product-info">
        <p className="product-title">{product.title}</p>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
