import React, { useState, useEffect } from 'react';
import { getAccountDetails } from '../services/api';
import '../styles/AccountDetails.css';

const AccountDetails = ({ publicKey }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  
  // Retrieve the full account data including secret key from localStorage
  const fullAccount = JSON.parse(localStorage.getItem('stellarAccount'));
  
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const data = await getAccountDetails(publicKey);
        setAccountData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load account details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountData();
  }, [publicKey]);
  
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`${field} copied to clipboard!`);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  if (loading) {
    return <div className="account-details loading">Loading account details...</div>;
  }
  
  if (error) {
    return <div className="account-details error">{error}</div>;
  }
  
  return (
    <div className="account-details">
      <h2>Account Details</h2>
      
      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">Public Key:</span>
          <div className="detail-value-container">
            <span className="detail-value">{publicKey}</span>
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(publicKey, 'Public Key')}
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Secret Key:</span>
          <div className="detail-value-container">
            {!showSecretKey ? (
              <>
                <span className="detail-value masked-value">••••••••••••••••••••••••••••••••••••••••••••••••••</span>
                <button 
                  className="show-button"
                  onClick={() => setShowSecretKey(true)}
                >
                  Show
                </button>
              </>
            ) : (
              <>
                <span className="detail-value">{fullAccount.secretKey}</span>
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(fullAccount.secretKey, 'Secret Key')}
                >
                  Copy
                </button>
                <button 
                  className="hide-button"
                  onClick={() => setShowSecretKey(false)}
                >
                  Hide
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Active Trustlines:</span>
          <div className="detail-value-container trustlines">
            {accountData.balances
              .filter(balance => balance.asset_type !== 'native')
              .map((balance, index) => (
                <div key={index} className="trustline-item">
                  <span className="trustline-asset">{balance.asset_code}</span>
                  <span className="trustline-issuer">
                    Issuer: {balance.asset_issuer.substring(0, 8)}...
                  </span>
                </div>
              ))}
            {accountData.balances.filter(balance => balance.asset_type !== 'native').length === 0 && (
              <span className="detail-value">No custom assets</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="details-warning">
        <strong>IMPORTANT:</strong> Never share your secret key with anyone. 
        Anyone with your secret key has full control of your account.
      </div>
    </div>
  );
};

export default AccountDetails;