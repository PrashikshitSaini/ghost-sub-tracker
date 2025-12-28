import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. REPLACE THIS URL with your actual Invoke URL from API Gateway
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log("Raw Data Received:", data); // Check your Browser Console (F12) to see this!
        
        // LAYER 1: Handle API Gateway double-encoding
        let bodyData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // LAYER 2: If the Lambda returns { body: "..." }, extract it
        if (bodyData && bodyData.body && typeof bodyData.body === 'string') {
            bodyData = JSON.parse(bodyData.body);
        } else if (bodyData && bodyData.body) {
            bodyData = bodyData.body;
        }

        // LAYER 3: Force it to be an array or an empty list
        const finalArray = Array.isArray(bodyData) ? bodyData : [];
        
        setSubs(finalArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Safe Reduce: This will NEVER crash now because subs is guaranteed to be an array
  const totalSpend = (Array.isArray(subs) ? subs : []).reduce((acc, sub) => {
    const costValue = parseFloat(sub.cost) || 0;
    return acc + costValue;
  }, 0);

  if (error) {
    return (
      <div className="dashboard error-state">
        <h1>⚠️ Connection Error</h1>
        <p>Could not reach the Vault. Check your API Gateway Invoke URL and CORS settings.</p>
        <code style={{background: '#441111', padding: '10px'}}>{error}</code>
        <button onClick={() => window.location.reload()} style={{marginTop: '20px', padding: '10px'}}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <div className="title-group">
          <h1>👻 Ghost Sub Tracker</h1>
          <p>Real-time surveillance of your subscriptions.</p>
        </div>
        <div className="stats-card">
          <span className="label">Monthly Burn</span>
          <span className="amount">${totalSpend.toFixed(2)}</span>
        </div>
      </header>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Scanning the Vault...</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Monthly Cost</th>
                <th>Next Renewal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subs.length > 0 ? (
                subs.map((sub, index) => (
                  <tr key={sub.original_msg_id || index}>
                    <td className="merchant-name">{sub.merchant || "Unknown"}</td>
                    <td className="cost-cell">${parseFloat(sub.cost || 0).toFixed(2)}</td>
                    <td>{sub.renewal_date || "N/A"}</td>
                    <td><span className="badge active">Active</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '40px'}}>
                    No subscriptions found. Try sending a receipt!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;