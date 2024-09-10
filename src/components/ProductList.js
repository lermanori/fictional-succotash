// src/components/ProductList.js

import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products,onClick=()=>{} }) => {
  return (
    <div className="product-list">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} onClick={onClick} />
      ))}
    </div>
  );
};

export default ProductList;
