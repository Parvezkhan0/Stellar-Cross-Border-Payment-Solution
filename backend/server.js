// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stellarService = require('./stellar-service');
const StellarSdk = require('stellar-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.post('/api/account/create', async (req, res) => {
  try {
    const account = await stellarService.createAccount();
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/account/import', (req, res) => {
  try {
    const { secretKey } = req.body;
    
    if (!secretKey) {
      return res.status(400).json({ error: 'Secret key is required' });
    }
    
    const account = stellarService.importAccount(secretKey);
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/account/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const accountDetails = await stellarService.getAccountDetails(publicKey);
    res.json(accountDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment', async (req, res) => {
  try {
    const { senderSecretKey, receiverPublicKey, amount, asset, issuer, memo } = req.body;
    
    if (!senderSecretKey || !receiverPublicKey || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const result = await stellarService.makePayment(
      senderSecretKey, 
      receiverPublicKey, 
      amount, 
      asset || 'XLM', 
      issuer, 
      memo
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// New route to create a custom asset
app.post('/api/asset/create', (req, res) => {
  try {
    const { assetCode, issuerPublicKey } = req.body;
    
    if (!assetCode || !issuerPublicKey) {
      return res.status(400).json({ error: 'Asset code and issuer public key are required' });
    }
    
    // Create the asset (this doesn't actually create anything on the network,
    // just returns an asset object that can be used in other operations)
    const asset = stellarService.createCustomAsset(assetCode, issuerPublicKey);
    
    // Return a simplified representation of the asset
    res.json({
      assetCode: asset.code,
      issuer: asset.issuer,
      assetType: asset.assetType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route to establish trust for an asset
app.post('/api/asset/trust', async (req, res) => {
  try {
    const { secretKey, assetCode, issuerPublicKey } = req.body;
    
    if (!secretKey || !assetCode || !issuerPublicKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Create a keypair from the secret key
    const keypair = StellarSdk.Keypair.fromSecret(secretKey);
    
    // Create the asset object
    const asset = stellarService.createCustomAsset(assetCode, issuerPublicKey);
    
    // Establish trust
    const result = await stellarService.establishTrust(keypair, asset);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route to issue a custom asset
app.post('/api/asset/issue', async (req, res) => {
  try {
    const { issuerSecretKey, destinationPublicKey, assetCode, amount } = req.body;
    
    if (!issuerSecretKey || !destinationPublicKey || !assetCode || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Create a keypair for the issuer
    const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecretKey);
    
    // Create the asset object
    const asset = stellarService.createCustomAsset(assetCode, issuerKeypair.publicKey());
    
    // Issue the asset
    const result = await stellarService.issueAsset(issuerKeypair, destinationPublicKey, asset, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});