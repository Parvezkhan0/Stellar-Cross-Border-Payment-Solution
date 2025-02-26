// src/services/api.js
const API_URL = 'http://localhost:5000/api';

export const createAccount = async () => {
  try {
    const response = await fetch(`${API_URL}/account/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create account');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const importAccount = async (secretKey) => {
  try {
    const response = await fetch(`${API_URL}/account/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secretKey })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to import account');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getAccountDetails = async (publicKey) => {
  try {
    const response = await fetch(`${API_URL}/account/${publicKey}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch account details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const makePayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to make payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Create a custom asset
 * @param {Object} assetData - Contains assetCode and issuerPublicKey
 * @returns {Promise<Object>} Asset details
 */
export const createCustomAsset = async (assetData) => {
  try {
    const response = await fetch(`${API_URL}/asset/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assetData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create custom asset');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Establish trust for a custom asset
 * @param {Object} trustData - Contains secretKey, assetCode, and issuerPublicKey
 * @returns {Promise<Object>} Transaction result
 */
export const establishTrust = async (trustData) => {
  try {
    const response = await fetch(`${API_URL}/asset/trust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trustData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to establish trust for asset');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Issue a custom asset to an account
 * @param {Object} issueData - Contains issuerSecretKey, destinationPublicKey, assetCode, and amount
 * @returns {Promise<Object>} Transaction result
 */
export const issueAsset = async (issueData) => {
  try {
    const response = await fetch(`${API_URL}/asset/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to issue asset');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};