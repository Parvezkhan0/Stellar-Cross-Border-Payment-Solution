import React, { useState } from 'react';
import { createAccount, importAccount } from '../services/api';
import '../styles/AccountCreator.css';

const AccountCreator = ({ onAccountCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [showImport, setShowImport] = useState(false);
  
  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const newAccount = await createAccount();
      onAccountCreated(newAccount);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportAccount = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      setError('Secret key is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const importedAccount = await importAccount(secretKey);
      onAccountCreated(importedAccount);
    } catch (err) {
      setError('Failed to import account. Please check your secret key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="account-creator">
      <div className="creator-card">
        <h2>Welcome to Stellar Cross-Border</h2>
        <p className="creator-info">
          This application allows you to make cross-border payments using the Stellar blockchain.
          To get started, create a new Stellar account or import an existing one.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        {!showImport ? (
          <>
            <button 
              className="create-button" 
              onClick={handleCreateAccount} 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create New Account'}
            </button>
            
            <button 
              className="import-toggle-button" 
              onClick={() => setShowImport(true)}
              disabled={loading}
            >
              Import Existing Account
            </button>
          </>
        ) : (
          <form onSubmit={handleImportAccount} className="import-form">
            <div className="form-group">
              <label htmlFor="secretKey">Secret Key</label>
              <input
                type="password"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your secret key"
                className="secret-key-input"
                disabled={loading}
                required
              />
            </div>
            
            <div className="button-group">
              <button 
                type="submit" 
                className="import-button" 
                disabled={loading}
              >
                {loading ? 'Importing...' : 'Import Account'}
              </button>
              
              <button 
                type="button"
                className="cancel-button" 
                onClick={() => {
                  setShowImport(false);
                  setSecretKey('');
                  setError(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        <div className="creator-note">
          <strong>Note:</strong> This will create a test account on the Stellar Testnet.
          For production use, you would need to fund a real Stellar account.
        </div>
      </div>
    </div>
  );
};

export default AccountCreator;