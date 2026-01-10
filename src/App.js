import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import { Button } from './components/ui/button';
import { useCurrency } from './contexts/CurrencyContext';

// Check if we are on localhost or Vercel
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const currentUrl = isLocalhost 
  ? 'http://localhost:3000/' 
  : 'https://ghost-sub-tracker.vercel.app/';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_PwJiIoMUP',
      userPoolClientId: '6tcku9kavi4tuml59b7q0t1bgr',
      loginWith: {
        oauth: {
          domain: 'us-east-2pwjiiomup.auth.us-east-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [currentUrl],
          redirectSignOut: [currentUrl],
          responseType: 'code'
        }
      }
    }
  }
});

const components = {
  Header() {
    return (
      <div className="text-center mb-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-foreground/20 shadow-lg overflow-hidden bg-white/5 backdrop-blur-sm">
            <img src="/favicon-512.png" alt="Ghost Sub Tracker" className="w-full h-full object-cover scale-110" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Ghost Sub Tracker</h1>
            <p className="text-sm text-muted-foreground">Real-time surveillance of your subscriptions</p>
          </div>
        </div>
      </div>
    );
  },
};

function AppContent({ signOut, user }) {
  const { currency, setCurrency, currencies } = useCurrency();
  const [userEmail, setUserEmail] = useState(user.attributes?.email || user.signInDetails?.loginId || user.username);
  
  // Extract email from ID token for OAuth users
  useEffect(() => {
    const getEmailFromSession = async () => {
      try {
        // Try user.attributes.email first (standard Cognito users)
        if (user.attributes?.email) {
          setUserEmail(user.attributes.email);
          return;
        }
        
        // For OAuth users, fetch session and extract email from ID token
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          const idToken = session.tokens.idToken;
          const tokenString = idToken.toString();
          try {
            const payload = JSON.parse(atob(tokenString.split('.')[1]));
            if (payload.email) {
              setUserEmail(payload.email);
              return;
            }
          } catch (e) {
            console.warn('Could not parse ID token:', e);
          }
        }
        
        // Fallback to other identifiers
        setUserEmail(user.signInDetails?.loginId || user.username);
      } catch (error) {
        console.warn('Could not fetch email from session:', error);
        // Fallback to other identifiers
        setUserEmail(user.signInDetails?.loginId || user.username);
      }
    };
    
    getEmailFromSession();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-foreground/20 shadow-md overflow-hidden bg-white/5 backdrop-blur-sm">
              <img src="/favicon-512.png" alt="Ghost Sub Tracker" className="w-full h-full object-cover scale-110" />
            </div>
            <h2 className="text-sm text-muted-foreground">
              Ghost Sub Tracker for <span className="text-foreground font-medium">{userEmail}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="currency-select" className="text-sm text-muted-foreground">
                Currency:
              </label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.entries(currencies).map(([code, info]) => (
                  <option key={code} value={code}>
                    {code} - {info.name}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Authenticator components={components} socialProviders={['google']}>
      {({ signOut, user }) => (
        <AppContent signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

export default App;