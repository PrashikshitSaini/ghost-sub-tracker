import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Skeleton } from './components/ui/skeleton';

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
                        <TableCell className="px-6 py-4 font-medium">{sub.merchant || "Unknown"}</TableCell>
                        <TableCell className="px-6 py-4 font-mono text-right">${parseFloat(sub.cost || 0).toFixed(2)}</TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground">{sub.renewal_date || "N/A"}</TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Badge variant="success" className="font-normal">Active</Badge>
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

export default App;