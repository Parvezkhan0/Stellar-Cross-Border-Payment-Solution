# Stellar Cross-Border Payment Solution

A full-stack application leveraging the Stellar blockchain to facilitate seamless cross-border payments and asset transfers with minimal fees and near-instant settlement.

## 🌟 Overview

This application demonstrates how Stellar's blockchain infrastructure can revolutionize international payments by:

- Eliminating high remittance fees typically charged by traditional financial institutions
- Providing near-instant settlement across borders (3-5 seconds)
- Supporting multi-currency transactions through anchored assets and pathfinding
- Enabling custom asset creation and trustline management

## 🚀 Features

- **Account Management:** Create and import Stellar accounts on the testnet
- **Multi-Currency Support:** Send and receive XLM and custom assets
- **Trustline Management:** Create and manage asset trustlines
- **Custom Asset Creation:** Issue your own assets on the Stellar network
- **Real-time Dashboard:** Monitor account balances and transaction history
- **Cross-Border Payments:** Execute payments across different currencies with automatic conversion

## 📋 Project Structure

```
stellar-cross-border-app/
├── backend/
│   ├── server.js
│   ├── stellar-service.js
│   └── package.json
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── ...
    ├── src/
    │   ├── components/
    │   │   ├── AccountCreator.js
    │   │   ├── AccountDetails.js
    │   │   ├── Dashboard.js
    │   │   ├── NavBar.js
    │   │   ├── PaymentForm.js
    │   │   └── TrustlineForm.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── App.css
    │   │   ├── AccountCreator.css
    │   │   ├── AccountDetails.css
    │   │   ├── Dashboard.css
    │   │   ├── NavBar.css
    │   │   ├── PaymentForm.css
    │   │   └── TrustlineForm.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔧 Technologies Used

### Backend
- Node.js
- Express.js
- Stellar SDK
- Horizon API

### Frontend
- React.js
- Axios for API requests
- localStorage for account management (demo purposes only)
- CSS for styling

## 🛠️ Installation and Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Steps to Run the Application

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/stellar-cross-border-app.git
   cd stellar-cross-border-app
   ```

2. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Navigate to `http://localhost:3000` in your browser

## 📝 Usage Guide

### Account Creation and Management
1. On first launch, choose to create a new account or import an existing one
2. **IMPORTANT:** Save both public and secret keys for all accounts
3. Label accounts (e.g., "SENDER", "RECEIVER", "ISSUER") for better management

### Dashboard
- View your current XLM and custom asset balances
- Monitor recent transactions
- Auto-refreshes every 30 seconds

### Sending Payments
1. Navigate to the Payment form
2. Enter recipient's Stellar address
3. Specify amount and asset type
4. For custom assets, provide the asset issuer's public key
5. Confirm and send the transaction

### Custom Asset Workflow
1. **Create custom asset:**
   - Log in with an ISSUER account
   - Define an asset code (e.g., "NEW")

2. **Establish trustlines:**
   - Log in with SENDER account
   - Create trustline for "NEW" asset with ISSUER's public address
   - Repeat for RECEIVER account

3. **Issue assets:**
   - Log in with ISSUER account
   - Send "NEW" assets to SENDER/RECEIVER

4. **Transfer custom assets:**
   - SENDER and RECEIVER can now exchange "NEW" assets

## ⚠️ Important Notes

This application is a **Proof of Concept** running on Stellar's Testnet. For production use, you would need to:

- Switch to Stellar Mainnet (change TESTNET to PUBLIC in the backend code)
- Implement proper security measures for secret key storage (NEVER store in localStorage)
- Add comprehensive error handling and validation
- Set up proper user authentication
- Implement KYC/AML compliance measures
- Add transaction monitoring and reporting
- Consider using a custody solution for key management

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kapildev5262/Stellar-Cross-Border-Payment-Solution/issues).

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Stellar Documentation](https://developers.stellar.org/docs)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Horizon API Reference](https://developers.stellar.org/api)