import React, { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

function Dashboard() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // 1. Get the current session
        const session = await fetchAuthSession();
        console.log("Session fetched:", session);
        
        // 2. Extract the ID Token (this is the "key" for the authorizer)
        // Verify we're using ID Token (contains email claim), not Access Token
        const idToken = session.tokens.idToken;
        const token = idToken.toString();
        
        // Debug: Log token info (first 50 chars only for security)
        console.log("ID Token (first 50 chars):", token.substring(0, 50) + "...");
        console.log("Token type check - ID Token exists:", !!idToken);
        
        // Verify token contains email claim
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log("Token payload (email claim):", tokenPayload.email || tokenPayload['cognito:username']);
        } catch (e) {
          console.warn("Could not parse token payload:", e);
        }

        const API_URL = process.env.REACT_APP_API_URL;
        console.log("API URL:", API_URL);

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            // 3. THIS MUST MATCH THE 'TOKEN SOURCE' IN API GATEWAY (which is 'Authorization')
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Raw response data:", data);
        
        // Check if response contains an error (even with 200 status)
        if (data.error || data.statusCode === 401) {
          console.error("Error in response body:", data);
          throw new Error(data.error || "Unauthorized: No email found in Authorizer context");
        }
        
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
        console.log("Final subscriptions array:", finalArray);
        
        setSubs(finalArray);
        setLoading(false);
      } catch (err) {
        console.error("Fetch failed - Full error:", err);
        console.error("Error stack:", err.stack);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Safe Reduce: This will NEVER crash now because subs is guaranteed to be an array
  const totalSpend = (Array.isArray(subs) ? subs : []).reduce((acc, sub) => {
    const costValue = parseFloat(sub.cost) || 0;
    return acc + costValue;
  }, 0);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-16 max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold">Connection Error</CardTitle>
              <CardDescription className="text-base">
                Could not reach the API. Check your API Gateway Invoke URL and CORS settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 border">
                <code className="text-sm font-mono text-foreground">{error}</code>
              </div>
              <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
                Retry Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Ghost Sub Tracker</h1>
              <p className="text-muted-foreground text-sm">
                Real-time surveillance of your subscriptions
              </p>
            </div>
            <Card className="w-full sm:w-auto sm:min-w-[220px]">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  Monthly Spend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">${totalSpend.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Skeleton className="h-12 w-12 rounded-full bg-muted" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Loading subscriptions...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">Subscriptions</CardTitle>
              <CardDescription className="text-sm mt-1">
                Active subscription services
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {subs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b hover:bg-muted/30">
                      <TableHead className="h-11 px-6 font-medium text-xs uppercase tracking-wider">Merchant</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-xs uppercase tracking-wider text-right">Monthly Cost</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-xs uppercase tracking-wider">Next Renewal</TableHead>
                      <TableHead className="h-11 px-6 font-medium text-xs uppercase tracking-wider text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subs.map((sub, index) => (
                      <TableRow key={sub.original_msg_id || index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <TableCell className="px-6 py-4 font-medium">{sub.merchant || sub.sub_name || "Unknown"}</TableCell>
                        <TableCell className="px-6 py-4 font-mono text-right">${parseFloat(sub.cost || 0).toFixed(2)}</TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground">{sub.renewal_date || "N/A"}</TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Badge 
                            variant={sub.status === "Active" ? "success" : "destructive"} 
                            className="font-normal"
                          >
                            {sub.status || "Active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 border">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">No subscriptions found</h3>
                  <p className="text-sm text-muted-foreground">Try sending a receipt to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

