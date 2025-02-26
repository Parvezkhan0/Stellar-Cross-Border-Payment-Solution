import React, { useState } from 'react';
import { createCustomAsset, establishTrust, issueAsset } from '../services/api';
import '../styles/TrustlineForm.css';

const TrustlineForm = ({ account }) => {
  const [activeTab, setActiveTab] = useState('trustAsset');
  
  // State for establishing trust
  const [trustData, setTrustData] = useState({
    assetCode: '',
    issuerPublicKey: ''
  });
  
  // State for creating custom asset
  const [assetData, setAssetData] = useState({
    assetCode: ''
  });
  
  // State for issuing asset
  const [issueData, setIssueData] = useState({
    assetCode: '',
    recipientPublicKey: '',
    amount: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleTrustChange = (e) => {
    const { name, value } = e.target;
    setTrustData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAssetChange = (e) => {
    const { name, value } = e.target;
    setAssetData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setIssueData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEstablishTrust = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate inputs
      if (!trustData.assetCode || !trustData.issuerPublicKey) {
        throw new Error('Asset code and issuer address are required');
      }
      
      // Create the trustline using establishTrust
      const result = await establishTrust({
        secretKey: account.secretKey,
        assetCode: trustData.assetCode,
        issuerPublicKey: trustData.issuerPublicKey
      });
      
      setSuccess(`Trust established successfully! Transaction ID: ${result.id}`);
      
      // Reset form after successful trust establishment
      setTrustData({
        assetCode: '',
        issuerPublicKey: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to establish trust. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate inputs
      if (!assetData.assetCode) {
        throw new Error('Asset code is required');
      }
      
      // Create the custom asset
      const asset = await createCustomAsset({
        assetCode: assetData.assetCode,
        issuerPublicKey: account.publicKey
      });
      
      setSuccess(`Asset ${assetData.assetCode} created successfully!`);
      
      // Reset form after successful asset creation
      setAssetData({
        assetCode: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to create asset. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleIssueAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate inputs
      if (!issueData.assetCode || !issueData.recipientPublicKey || !issueData.amount) {
        throw new Error('Asset code, recipient address, and amount are required');
      }
      
      // Issue the asset to the recipient
      const issueResult = await issueAsset({
        issuerSecretKey: account.secretKey,
        destinationPublicKey: issueData.recipientPublicKey,
        assetCode: issueData.assetCode,
        amount: issueData.amount
      });
      
      setSuccess(`Asset ${issueData.assetCode} issued successfully! Transaction ID: ${issueResult.id}`);
      
      // Reset form after successful asset issuance
      setIssueData({
        assetCode: '',
        recipientPublicKey: '',
        amount: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to issue asset. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="trustline-form-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'trustAsset' ? 'active' : ''}`}
          onClick={() => setActiveTab('trustAsset')}
        >
          Establish Trust
        </button>
        <button 
          className={`tab ${activeTab === 'createAsset' ? 'active' : ''}`}
          onClick={() => setActiveTab('createAsset')}
        >
          Create Asset
        </button>
        <button 
          className={`tab ${activeTab === 'issueAsset' ? 'active' : ''}`}
          onClick={() => setActiveTab('issueAsset')}
        >
          Issue Asset
        </button>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
      
      {activeTab === 'trustAsset' && (
        <div className="tab-content">
          <h2>Establish Trust for an Asset</h2>
          
          <div className="trustline-info">
            <p>
              Establishing trust allows your account to hold assets other than XLM.
              You need to establish trust for each asset you want to receive.
            </p>
          </div>
          
          <form className="trustline-form" onSubmit={handleEstablishTrust}>
            <div className="form-group">
              <label htmlFor="assetCode">Asset Code</label>
              <input
                type="text"
                id="assetCode"
                name="assetCode"
                value={trustData.assetCode}
                onChange={handleTrustChange}
                placeholder="e.g. USD, EUR, TOKEN"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="issuerPublicKey">Asset Issuer</label>
              <input
                type="text"
                id="issuerPublicKey"
                name="issuerPublicKey"
                value={trustData.issuerPublicKey}
                onChange={handleTrustChange}
                placeholder="Issuer Stellar Address (G...)"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Establish Trust'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'createAsset' && (
        <div className="tab-content">
          <h2>Create Custom Asset</h2>
          
          <div className="trustline-info">
            <p>
              Create a new custom asset that you'll be the issuer of.
              Once created, others can establish trust for this asset
              to receive payments from you.
            </p>
          </div>
          
          <form className="trustline-form" onSubmit={handleCreateAsset}>
            <div className="form-group">
              <label htmlFor="createAssetCode">Asset Code</label>
              <input
                type="text"
                id="createAssetCode"
                name="assetCode"
                value={assetData.assetCode}
                onChange={handleAssetChange}
                placeholder="Your custom asset code (e.g. USD)"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Issuer Address</label>
              <div className="static-field">{account.publicKey}</div>
              <small>This is your account address, which will be the issuer</small>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Asset'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'issueAsset' && (
        <div className="tab-content">
          <h2>Issue Asset</h2>
          
          <div className="trustline-info">
            <p>
              Issue your custom asset to accounts that have already established trust.
              The recipient must have a trustline for your asset before you can send it.
            </p>
          </div>
          
          <form className="trustline-form" onSubmit={handleIssueAsset}>
            <div className="form-group">
              <label htmlFor="issueAssetCode">Asset Code</label>
              <input
                type="text"
                id="issueAssetCode"
                name="assetCode"
                value={issueData.assetCode}
                onChange={handleIssueChange}
                placeholder="Asset code to issue"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientPublicKey">Recipient Address</label>
              <input
                type="text"
                id="recipientPublicKey"
                name="recipientPublicKey"
                value={issueData.recipientPublicKey}
                onChange={handleIssueChange}
                placeholder="Recipient Stellar Address (G...)"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Amount to Issue</label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={issueData.amount}
                onChange={handleIssueChange}
                placeholder="Amount (e.g. 1000)"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Issuing...' : 'Issue Asset'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TrustlineForm;