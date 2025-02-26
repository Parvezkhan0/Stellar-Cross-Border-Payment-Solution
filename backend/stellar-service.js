const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');

// Configure Stellar SDK for testnet (use 'public' for mainnet)
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const network = StellarSdk.Networks.TESTNET;

class StellarService {
  /**
   * Create a new Stellar account
   * @returns {Object} Object containing the public key and secret key
   */
  async createAccount() {
    const pair = StellarSdk.Keypair.random();
    const publicKey = pair.publicKey();
    const secretKey = pair.secret();
    
    // Fund the account using Friendbot (testnet only)
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      await response.json();
      
      return {
        publicKey,
        secretKey
      };
    } catch (error) {
      console.error('Error funding account:', error);
      throw new Error('Failed to create and fund account');
    }
  }
  
  /**
   * Import an existing Stellar account using secret key
   * @param {string} secretKey - The secret key of the account to import
   * @returns {Object} Object containing the public key and secret key
   */
  importAccount(secretKey) {
    try {
      // Validate the secret key by attempting to create a keypair
      const keypair = StellarSdk.Keypair.fromSecret(secretKey);
      const publicKey = keypair.publicKey();
      
      return {
        publicKey,
        secretKey
      };
    } catch (error) {
      console.error('Error importing account:', error);
      throw new Error('Failed to import account: Invalid secret key');
    }
  }
  
  /**
   * Get account balance and transaction history
   * @param {string} publicKey - The account's public key
   * @returns {Object} Account details including balances and transactions
   */
  async getAccountDetails(publicKey) {
    try {
      const account = await server.loadAccount(publicKey);
      const transactions = await server.transactions()
        .forAccount(publicKey)
        .limit(10)
        .order('desc')
        .call();
      
      return {
        balances: account.balances,
        transactions: transactions.records
      };
    } catch (error) {
      console.error('Error fetching account details:', error);
      throw new Error('Failed to fetch account details');
    }
  }
  
  /**
   * Make a cross-border payment
   * @param {string} senderSecretKey - The sender's secret key
   * @param {string} receiverPublicKey - The receiver's public key
   * @param {string} amount - Amount to send
   * @param {string} asset - Asset code (e.g., 'XLM', 'USD')
   * @param {string} issuer - Asset issuer (null for XLM)
   * @param {string} memo - Optional memo for the transaction
   * @returns {Object} Transaction result
   */
  async makePayment(senderSecretKey, receiverPublicKey, amount, asset = 'XLM', issuer = null, memo = '') {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(senderSecretKey);
      const sourcePublicKey = sourceKeypair.publicKey();
      
      // Load the source account
      const sourceAccount = await server.loadAccount(sourcePublicKey);
      
      // Start building the transaction
      let transaction = new StellarSdk.TransactionBuilder(sourceAccount, { 
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: network
      });
      
      // Add memo if provided
      if (memo) {
        transaction = transaction.addMemo(StellarSdk.Memo.text(memo));
      }
      
      // Determine which asset to send
      let assetToSend;
      if (asset.toUpperCase() === 'XLM') {
        assetToSend = StellarSdk.Asset.native();
      } else if (issuer) {
        assetToSend = new StellarSdk.Asset(asset, issuer);
      } else {
        throw new Error('Issuer is required for non-XLM assets');
      }
      
      // Add payment operation
      transaction = transaction.addOperation(
        StellarSdk.Operation.payment({
          destination: receiverPublicKey,
          asset: assetToSend,
          amount: amount.toString()
        })
      )
      .setTimeout(30)
      .build();
      
      // Sign the transaction
      transaction.sign(sourceKeypair);
      
      // Submit to the network
      const transactionResult = await server.submitTransaction(transaction);
      return transactionResult;
    } catch (error) {
      console.error('Error making payment:', error);
      throw new Error(`Failed to make payment: ${error.message}`);
    }
  }
  
  

  /**
   * Create a custom asset
   * @param {string} assetCode - The code for the custom asset (e.g., 'USD')
   * @param {string} issuerPublicKey - The public key of the issuer account
   * @returns {Object} The created asset
   */
  createCustomAsset(assetCode, issuerPublicKey) {
    try {
      // Create a new asset with the given code and issuer
      const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);
      return asset;
    } catch (error) {
      console.error('Error creating custom asset:', error);
      throw new Error(`Failed to create custom asset: ${error.message}`);
    }
  }

  /**
   * Establish trust for a custom asset
   * @param {Object} keypair - The Stellar keypair of the trusting account
   * @param {Object} asset - The custom asset to trust
   * @returns {Object} Transaction result
   */
  async establishTrust(keypair, asset) {
    try {
      // Load the account
      const account = await server.loadAccount(keypair.publicKey());
      
      // Create a transaction to establish the trustline
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: network
      })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: asset
        })
      )
      .setTimeout(30)
      .build();
      
      // Sign and submit the transaction
      transaction.sign(keypair);
      return await server.submitTransaction(transaction);
    } catch (error) {
      console.error('Error establishing trust:', error);
      throw new Error(`Failed to establish trust: ${error.message}`);
    }
  }

  /**
   * Issue a custom asset to an account
   * @param {Object} issuerKeypair - The keypair of the issuing account
   * @param {string} destinationPublicKey - The public key of the receiving account
   * @param {Object} asset - The custom asset to issue
   * @param {string} amount - The amount to issue
   * @returns {Object} Transaction result
   */
  async issueAsset(issuerKeypair, destinationPublicKey, asset, amount) {
    try {
      // Load the issuer account
      const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
      
      // Create a transaction to issue the asset
      const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: network
      })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: asset,
          amount: amount.toString()
        })
      )
      .setTimeout(30)
      .build();
      
      // Sign and submit the transaction
      transaction.sign(issuerKeypair);
      return await server.submitTransaction(transaction);
    } catch (error) {
      console.error('Error issuing asset:', error);
      throw new Error(`Failed to issue asset: ${error.message}`);
    }
  }
}

module.exports = new StellarService();