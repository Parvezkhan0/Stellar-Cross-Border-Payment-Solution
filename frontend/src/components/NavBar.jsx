import React from 'react';
import '../styles/NavBar.css';

const NavBar = ({ account, onNavChange, currentView, onLogout }) => {
  if (!account) return null;
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Stellar Cross-Border</h1>
      </div>
      <ul className="navbar-menu">
        <li className={currentView === 'dashboard' ? 'active' : ''}>
          <button onClick={() => onNavChange('dashboard')}>Dashboard</button>
        </li>
        <li className={currentView === 'details' ? 'active' : ''}>
          <button onClick={() => onNavChange('details')}>Account Details</button>
        </li>
        <li className={currentView === 'payment' ? 'active' : ''}>
          <button onClick={() => onNavChange('payment')}>Send Payment</button>
        </li>
        <li className={currentView === 'trustline' ? 'active' : ''}>
          <button onClick={() => onNavChange('trustline')}>Manage Trustlines</button>
        </li>
      </ul>
      <div className="navbar-account">
        <span className="account-label">Account: </span>
        <span className="account-id">{account.publicKey.substring(0, 8)}...</span>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;