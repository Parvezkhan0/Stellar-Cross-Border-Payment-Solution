import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import AccountCreator from './components/AccountCreator';
import AccountDetails from './components/AccountDetails';
import PaymentForm from './components/PaymentForm';
import TrustlineForm from './components/TrustlineForm';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [account, setAccount] = useState(null);
  
  // Retrieve saved account from localStorage on load
  React.useEffect(() => {
    const savedAccount = localStorage.getItem('stellarAccount');
    if (savedAccount) {
      setAccount(JSON.parse(savedAccount));
    }
  }, []);
  
  // Save account to localStorage when it changes
  React.useEffect(() => {
    if (account) {
      localStorage.setItem('stellarAccount', JSON.stringify(account));
    }
  }, [account]);
  
  const handleAccountCreated = (newAccount) => {
    setAccount(newAccount);
    setCurrentView('dashboard');
  };
  
  const handleLogout = () => {
    setAccount(null);
    localStorage.removeItem('stellarAccount');
    setCurrentView('createAccount');
  };
  
  // Render different views based on state
  const renderView = () => {
    if (!account) {
      return <AccountCreator onAccountCreated={handleAccountCreated} />;
    }
    
    switch (currentView) {
      case 'dashboard':
        return <Dashboard account={account} />;
      case 'details':
        return <AccountDetails publicKey={account.publicKey} />;
      case 'payment':
        return <PaymentForm account={account} />;
      case 'trustline':
        return <TrustlineForm account={account} />;
      default:
        return <Dashboard account={account} />;
    }
  };
  
  return (
    <div className="app">
      <NavBar 
        account={account} 
        onNavChange={setCurrentView} 
        currentView={currentView}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
