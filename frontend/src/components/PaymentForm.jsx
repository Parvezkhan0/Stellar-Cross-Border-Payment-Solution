import React, { useState } from 'react';
import { makePayment } from '../services/api';
import '../styles/PaymentForm.css';

const PaymentForm = ({ account }) => {
  const [formData, setFormData] = useState({
    receiverPublicKey: '',
    amount: '',
    asset: 'XLM',
    issuer: '',
    memo: ''
  });
  const [customAsset, setCustomAsset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAssetChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, asset: value }));
    setCustomAsset(value !== 'XLM');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate inputs
      if (!formData.receiverPublicKey || !formData.amount) {
        throw new Error('Recipient address and amount are required');
      }
      
      if (customAsset && !formData.issuer) {
        throw new Error('Issuer address is required for custom assets');
      }
      
      // Make the payment
      const result = await makePayment({
        senderSecretKey: account.secretKey,
        receiverPublicKey: formData.receiverPublicKey,
        amount: formData.amount,
        asset: formData.asset,
        issuer: customAsset ? formData.issuer : null,
        memo: formData.memo
      });
      
      setSuccess(`Payment successful! Transaction ID: ${result.id}`);
      
      // Reset form after successful payment
      setFormData({
        receiverPublicKey: '',
        amount: '',
        asset: 'XLM',
        issuer: '',
        memo: ''
      });
      setCustomAsset(false);
    } catch (err) {
      setError(err.message || 'Failed to send payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="payment-form-container">
      <h2>Send Payment</h2>
      
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
      
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="receiverPublicKey">Recipient Stellar Address</label>
          <input
            type="text"
            id="receiverPublicKey"
            name="receiverPublicKey"
            value={formData.receiverPublicKey}
            onChange={handleChange}
            placeholder="G..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="asset">Asset</label>
          <select
            id="asset"
            name="asset"
            value={formData.asset}
            onChange={handleAssetChange}
          >
            <option value="XLM">XLM (Stellar Lumens)</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="custom">Custom Asset</option>
          </select>
          
          {formData.asset === 'custom' && (
            <input
              type="text"
              name="asset"
              value={formData.asset === 'custom' ? '' : formData.asset}
              onChange={handleChange}
              placeholder="Asset Code (e.g. TOKEN)"
              className="custom-asset-input"
            />
          )}
        </div>
        
        {customAsset && (
          <div className="form-group">
            <label htmlFor="issuer">Asset Issuer</label>
            <input
              type="text"
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="Issuer Stellar Address (G...)"
              required
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="memo">Memo (Optional)</label>
          <input
            type="text"
            id="memo"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            placeholder="Add a memo to your payment"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Payment'}
        </button>
      </form>
      </div>
  );
};

export default PaymentForm;