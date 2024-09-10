// src/components/OrderReview.js

import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const OrderReview = ({ orderData, onConfirmOrder, onGoBack }) => {
  const { cart, totalSum, totalWeight, stackedDimensions } = orderData;
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const sigCanvas = useRef({});

  const handleConfirmOrder = () => {
    setIsConfirmed(true);
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSubmitSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      setSignatureError('Please provide a signature to proceed.');
      return;
    }

    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

    onConfirmOrder(signatureData);
  };

  return (
    <div className="order-review">
      <h2>Order Review</h2>
      <button className='back_button' onClick={onGoBack}>Back</button> {/* Back Button */}
      <ul>
        {cart.map((item, index) => {
          const totalItemWeight = parseFloat(item.shipping_weight) * item.quantity;
          const totalItemDimensions = {
            length: parseFloat(item.shipping_length),
            width: parseFloat(item.shipping_width),
            height: parseFloat(item.shipping_height),
          };

          return (
            <li key={index}>
              <p><strong>{item.title}</strong></p>
              <p><strong>Price:</strong> ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
              <p><strong>Weight:</strong> {totalItemWeight.toFixed(2)} lbs</p>
              <p><strong>Dimensions:</strong> {totalItemDimensions.length.toFixed(2)} in (L) x {totalItemDimensions.width.toFixed(2)} in (W) x {totalItemDimensions.height.toFixed(2)} in (H)}</p>
            </li>
          );
        })}
      </ul>
      <h3>Order Summary</h3>
      <p><strong>Total Price:</strong> ${totalSum.toFixed(2)}</p>
      <p><strong>Total Weight:</strong> {totalWeight.toFixed(2)} lbs</p>
      <p><strong>Total Stacked Dimensions:</strong> {stackedDimensions.totalUsedLength.toFixed(2)} in (L) x {stackedDimensions.totalUsedWidth.toFixed(2)} in (W) x {stackedDimensions.totalUsedHeight.toFixed(2)} in (H)}</p>

      {!isConfirmed ? (
        <button onClick={handleConfirmOrder}>Confirm Order</button>
      ) : (
        <>
          <h3>Please Sign Below:</h3>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          />
          {signatureError && <p style={{ color: 'red' }}>{signatureError}</p>}
          <div className="signature-actions">
            <button onClick={handleClearSignature}>Clear Signature</button>
            <button onClick={handleSubmitSignature}>Submit Signature</button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderReview;
