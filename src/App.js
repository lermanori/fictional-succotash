// src/App.js

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import SearchFilter from './components/SearchFilter';
import axios from 'axios';
import { parseString } from 'xml2js';
import './App.css';
import Cart from './components/Cart';
import Login from './components/Login';
import OrderReview from './components/OrderReview';

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReviewingOrder, setIsReviewingOrder] = useState(false); // Track if user is on the order review page
  const [orderData, setOrderData] = useState(null); // Store order data for review
  const [orderNumber, setOrderNumber] = useState(null); // Store generated order number

  useEffect(() => {
    axios.get('/data/data.xml')
      .then(response => {
        parseString(response.data, (err, result) => {
          const products = result.rss.channel[0].item.map(item => {
            return {
              id: item['g:id'] ? item['g:id'][0] : 'no data',
              title: item['g:title'] ? item['g:title'][0] : 'no data',
              description: item['g:description'] ? item['g:description'][0] : 'no data',
              link: item['g:link'] ? item['g:link'][0] : 'no data',
              image_link: item['g:image_link'] ? item['g:image_link'][0] : 'no data',
              condition: item['g:condition'] ? item['g:condition'][0] : 'no data',
              availability: item['g:availability'] ? item['g:availability'][0] : 'no data',
              price: item['g:price'] ? item['g:price'][0] : 'no data',
              gtin: item['g:gtin'] ? item['g:gtin'][0] : 'no data',
              mpn: item['g:mpn'] ? item['g:mpn'][0] : 'no data',
              unit_pricing_measure: item['g:unit_pricing_measure'] ? item['g:unit_pricing_measure'][0] : 'no data',
              unit_pricing_base_measure: item['g:unit_pricing_base_measure'] ? item['g:unit_pricing_base_measure'][0] : 'no data',
              shipping_weight: item['g:shipping_weight'] ? item['g:shipping_weight'][0] : 'no data',
              shipping_length: item['g:shipping_length'] ? item['g:shipping_length'][0] : 'no data',
              shipping_width: item['g:shipping_width'] ? item['g:shipping_width'][0] : 'no data',
              shipping_height: item['g:shipping_height'] ? item['g:shipping_height'][0] : 'no data',
            };
          });

          setProducts(products);
          setFilteredProducts(products);
        });
      });
  }, []);

  // Stacking algorithm to calculate used dimensions
  // src/App.js

  const calculateStacking = (cartItems, containerDimensions) => {
    const { containerLength, containerWidth, containerHeight } = containerDimensions;

    // Get the initial max width and length of the items in the cart
    let maxItemWidth = Math.max(...cartItems.map(item => parseFloat(item.shipping_width)));
    let maxItemLength = Math.max(...cartItems.map(item => parseFloat(item.shipping_length)));

    let currentHeight = 0;
    let currentWidth = maxItemWidth; // Start with the largest item width
    let currentLength = maxItemLength; // Start with the largest item length
    let totalUsedWidth = maxItemWidth; // Track how much width is used
    let totalUsedLength = maxItemLength; // Track how much length is used

    cartItems.forEach(item => {
      const itemHeight = parseFloat(item.shipping_height);
      const itemWidth = parseFloat(item.shipping_width);
      const itemLength = parseFloat(item.shipping_length);

      for (let i = 0; i < item.quantity; i++) {
        if (currentHeight + itemHeight <= containerHeight) {
          // Stack vertically
          currentHeight += itemHeight;
        } else {
          // If height exceeds, reset height and shift to a new row by adding to width
          currentHeight = itemHeight;

          if (currentWidth + itemWidth <= containerWidth) {
            // Shift to a new row within the same column
            totalUsedWidth += itemWidth;
            currentWidth += itemWidth;
          } else {
            // If width exceeds, reset the width and shift to a new column by adding to length
            totalUsedWidth = maxItemWidth; // Reset to the largest width of items
            currentWidth = itemWidth; // Start new row with this item's width

            if (currentLength + itemLength <= containerLength) {
              totalUsedLength += itemLength;
              currentLength += itemLength;
            } else {
              console.log("Container length exceeded. Item(s) don't fit.");
              break;
            }
          }
        }
      }
    });

    return {
      totalUsedHeight: currentHeight,
      totalUsedWidth: totalUsedWidth,
      totalUsedLength: totalUsedLength
    };
  };

  const handleSearch = (query) => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const handleCheckout = () => {
    // Assume the container dimensions
    const containerDimensions = {
      containerLength: 200,  // in inches
      containerWidth: 100,   // in inches
      containerHeight: 100,  // in inches
    };

    const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalWeight = cart.reduce((weight, item) => weight + parseFloat(item.shipping_weight) * item.quantity, 0);

    // Calculate stacking dimensions based on container
    const stackedDimensions = calculateStacking(cart, containerDimensions);

    // Set order data and show the review screen
    setOrderData({ cart, totalSum, totalWeight, stackedDimensions });
    setIsReviewingOrder(true);
  };

  const handleConfirmOrder = (signature) => {
    const newOrderNumber = Math.floor(Math.random() * 1000000);
    setOrderNumber(newOrderNumber);

    alert(`Order number: ${newOrderNumber} sent to office for approval`);
  };

  const handleLogin = (email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGoBack = () => {
    setIsReviewingOrder(false);  // Reset the state to go back to the cart or product list view
  };
  const handleClearCart = () => {
    setCart([]);  // Clear the cart
  };
  
  const handleRemoveItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));  // Remove specific item by filtering it out
  };
  // src/App.js

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : isReviewingOrder ? (
        <OrderReview
          orderData={orderData}
          onConfirmOrder={handleConfirmOrder}
          onGoBack={handleGoBack}  // Pass handleGoBack as a prop
        />
      ) : (
        <>
          <SearchFilter onSearch={handleSearch} />
          <ProductList products={filteredProducts} onClick={handleCardClick} />
          {selectedProduct && <ProductDetail product={selectedProduct} onClose={handleCloseModal} onAddToCart={handleAddToCart} />}
          <Cart
          cartItems={cart}
          onCheckout={handleCheckout}
          onClearCart={handleClearCart}  // Pass clear cart function
          onRemoveItem={handleRemoveItem}  // Pass remove item function
        />
        </>
      )}
    </div>
  );

};

export default App;
