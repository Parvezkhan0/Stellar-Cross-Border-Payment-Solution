import React, { useState, useEffect } from 'react';
import { getAccountDetails } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = ({ account }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const data = await getAccountDetails(account.publicKey);
        setAccountData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load account data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchAccountData, 30000);
    return () => clearInterval(interval);
  }, [account.publicKey]);
  
  if (loading) {
    return <div className="dashboard loading">Loading account data...</div>;
  }
  
  if (error) {
    return <div className="dashboard error">{error}</div>;
  }
  
  if (!accountData) {
    return <div className="dashboard no-data">No account data available</div>;
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Account Dashboard</h2>
        <button className="refresh-button" onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
      
      <div className="dashboard-section">
        <h3>Account Balance</h3>
        <div className="balance-cards">
          {accountData.balances.map((balance, index) => (
            <div className="balance-card" key={index}>
              <h4>
                {balance.asset_type === 'native' ? 'XLM (Stellar Lumens)' : balance.asset_code}
              </h4>
              <p className="balance-amount">{parseFloat(balance.balance).toFixed(2)}</p>
              {balance.asset_type !== 'native' && (
                <p className="balance-issuer">
                  Issuer: {balance.asset_issuer.substring(0, 8)}...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-section">
        <h3>Recent Transactions</h3>
        {accountData.transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accountData.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id.substring(0, 8)}...</td>
                    <td>{tx.operation_count > 1 ? 'Multiple' : 'Payment'}</td>
                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                    <td>
                      <span className="status success">Successful</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;