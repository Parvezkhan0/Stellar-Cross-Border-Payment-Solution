// Updated Stellar Cross-Border Payment POC for current SDK version
const StellarSdk = require('stellar-sdk');

// Configure the Stellar SDK to use the testnet
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networks = StellarSdk.Networks;

// Helper function to create and fund a new account
async function createAccount() {
  // Generate a new keypair
  const keypair = StellarSdk.Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();
  
  console.log(`Created new account: ${publicKey}`);
  console.log(`Secret key: ${secretKey}`);
  
  // Fund the account using Friendbot (testnet only)
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    const responseJSON = await response.json();
    console.log("Friendbot response:", responseJSON);
    console.log("Account funded successfully");
  } catch (error) {
    console.error("Error funding account:", error);
    throw error;
  }
  
  return { publicKey, secretKey, keypair };
}

// Function to check account balance
async function checkBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    console.log("Account balances:");
    account.balances.forEach((balance) => {
      console.log(`- ${balance.balance} ${balance.asset_type === 'native' ? 'XLM' : balance.asset_code}`);
    });
    return account.balances;
  } catch (error) {
    console.error("Error checking balance:", error);
    throw error;
  }
}

// Create a custom asset (representing foreign currency)
function createCustomAsset(code, issuerPublicKey) {
  return new StellarSdk.Asset(code, issuerPublicKey);
}

// Function to establish trust between accounts
async function establishTrust(receiverKeypair, asset) {
  try {
    const account = await server.loadAccount(receiverKeypair.publicKey());
    const fee = await server.fetchBaseFee();
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: networks.TESTNET
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: asset,
          limit: '1000' // Set a trust limit of 1000 units
        })
      )
      .setTimeout(30)
      .build();
    
    transaction.sign(receiverKeypair);
    
    const result = await server.submitTransaction(transaction);
    console.log("Trust established successfully");
    return result;
  } catch (error) {
    console.error("Error establishing trust:", error);
    throw error;
  }
}

// Issue custom asset to an account
async function issueAsset(issuerKeypair, distributorPublicKey, asset, amount) {
  try {
    const account = await server.loadAccount(issuerKeypair.publicKey());
    const fee = await server.fetchBaseFee();
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: networks.TESTNET
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: distributorPublicKey,
          asset: asset,
          amount: amount
        })
      )
      .setTimeout(30)
      .build();
    
    transaction.sign(issuerKeypair);
    
    const result = await server.submitTransaction(transaction);
    console.log(`${amount} ${asset.code} issued to ${distributorPublicKey}`);
    return result;
  } catch (error) {
    console.error("Error issuing asset:", error);
    throw error;
  }
}

// Make a cross-border payment
async function makeCrossBorderPayment(senderKeypair, receiverPublicKey, asset, amount) {
  try {
    const account = await server.loadAccount(senderKeypair.publicKey());
    const fee = await server.fetchBaseFee();
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: networks.TESTNET
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receiverPublicKey,
          asset: asset,
          amount: amount
        })
      )
      .setTimeout(30)
      .build();
    
    transaction.sign(senderKeypair);
    
    const result = await server.submitTransaction(transaction);
    console.log(`${amount} ${asset.code} sent to ${receiverPublicKey}`);
    return result;
  } catch (error) {
    console.error("Error making payment:", error);
    throw error;
  }
}

// Main function to demonstrate cross-border payment
async function demonstrateCrossBorderPayment() {
  try {
    console.log("====== STELLAR CROSS-BORDER PAYMENT POC ======");
    
    // 1. Create accounts for different participants
    console.log("\n1. Creating accounts...");
    const issuer = await createAccount(); // Asset issuer (e.g., a bank)
    const sender = await createAccount(); // Sender (e.g., customer in country A)
    const receiver = await createAccount(); // Receiver (e.g., recipient in country B)
    
    // 2. Check initial balances
    console.log("\n2. Checking initial balances...");
    await checkBalance(sender.publicKey);
    await checkBalance(receiver.publicKey);
    
    // 3. Create a custom asset (e.g., USD issued by a bank)
    console.log("\n3. Creating custom asset...");
    const usdAsset = createCustomAsset("USD", issuer.publicKey);
    console.log(`Created USD asset issued by ${issuer.publicKey}`);
    
    // 4. Establish trust for USD asset
    console.log("\n4. Establishing trust for the USD asset...");
    await establishTrust(sender.keypair, usdAsset);
    await establishTrust(receiver.keypair, usdAsset);
    
    // 5. Issue USD to the sender
    console.log("\n5. Issuing USD to the sender...");
    await issueAsset(issuer.keypair, sender.publicKey, usdAsset, "100");
    
    // 6. Check balances after issuance
    console.log("\n6. Checking balances after issuance...");
    await checkBalance(sender.publicKey);
    
    // 7. Make a cross-border payment
    console.log("\n7. Making cross-border payment...");
    await makeCrossBorderPayment(sender.keypair, receiver.publicKey, usdAsset, "50");
    
    // 8. Check final balances
    console.log("\n8. Checking final balances...");
    await checkBalance(sender.publicKey);
    await checkBalance(receiver.publicKey);
    
    console.log("\n====== CROSS-BORDER PAYMENT COMPLETED SUCCESSFULLY ======");
  } catch (error) {
    console.error("Error in demonstration:", error);
  }
}

// Execute the demonstration
demonstrateCrossBorderPayment();