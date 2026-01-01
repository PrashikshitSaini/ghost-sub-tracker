import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import { Button } from './components/ui/button';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_PwJiIoMUP',
      userPoolClientId: '6tcku9kavi4tuml59b7q0t1bgr'
    }
  }
});

const components = {
  Header() {
    return (
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Ghost Sub Tracker</h1>
        <p className="text-sm text-muted-foreground">Real-time surveillance of your subscriptions</p>
      </div>
    );
  },
};

function App() {
  return (
    <Authenticator components={components}>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm text-muted-foreground">
                  Ghost Sub Tracker for <span className="text-foreground font-medium">{user.signInDetails?.loginId || user.username}</span>
                </h2>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
          <Dashboard />
        </div>
      )}
    </Authenticator>
  );
}

export default App;