import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

function SetupWizard({ open, onOpenChange }) {
  const [selectedProvider, setSelectedProvider] = useState('gmail'); // 'gmail' or 'outlook'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Setup Auto-Forwarding</DialogTitle>
          <DialogDescription>
            Set up automatic email forwarding so subscription receipts are automatically tracked. 
            No more manual forwarding needed!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Important Notice */}
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Important: Use Web Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Email filters can only be set up using the web interface</strong>, not in mobile apps. 
                Please open <strong className="text-foreground">Gmail.com</strong> or <strong className="text-foreground">Outlook.com</strong> in your browser 
                (on your phone, tablet, or computer) to complete the setup. Once configured, the filters will work automatically 
                for all emails received on your account, including those on mobile apps.
              </p>
            </CardContent>
          </Card>

          {/* Provider Selection */}
          <div className="flex gap-2 border-b pb-4">
            <Button
              variant={selectedProvider === 'gmail' ? 'default' : 'outline'}
              onClick={() => setSelectedProvider('gmail')}
              className="flex-1"
            >
              Gmail
            </Button>
            <Button
              variant={selectedProvider === 'outlook' ? 'default' : 'outline'}
              onClick={() => setSelectedProvider('outlook')}
              className="flex-1"
            >
              Outlook
            </Button>
          </div>

          {/* Gmail Instructions */}
          {selectedProvider === 'gmail' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Open Gmail Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Open <strong className="text-foreground">Gmail.com</strong> in your web browser (not the mobile app)</li>
                    <li>Click the <strong className="text-foreground">gear icon</strong> (⚙️) in the top right corner of Gmail</li>
                    <li>Select <strong className="text-foreground">"See all settings"</strong></li>
                    <li>Click on the <strong className="text-foreground">"Filters and Blocked Addresses"</strong> tab</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Create a New Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Click <strong className="text-foreground">"Create a new filter"</strong> at the bottom of the page</li>
                    <li>In the <strong className="text-foreground">"Has the words"</strong> field, enter:
                      <div className="mt-2 p-3 bg-muted rounded-md font-mono text-xs">
                        (Receipt OR Invoice) AND (Netflix OR Disney OR Spotify OR Amazon OR Apple OR Microsoft)
                      </div>
                    </li>
                    <li>Click <strong className="text-foreground">"Create filter"</strong></li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 3: Set Up Forwarding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Check the box: <strong className="text-foreground">"Forward it to:"</strong></li>
                    <li>Enter: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">track@sub.prashikshit.dev</code></li>
                    <li>Check the box: <strong className="text-foreground">"Also apply filter to matching conversations"</strong> (optional, to process existing emails)</li>
                    <li>Click <strong className="text-foreground">"Create filter"</strong></li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You can customize the filter to match your specific subscription services. 
                    Just add more service names separated by "OR" in the filter criteria.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Outlook Instructions */}
          {selectedProvider === 'outlook' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Open Outlook Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Open <strong className="text-foreground">outlook.com</strong> in your web browser (not the mobile app) and sign in</li>
                    <li>Click the <strong className="text-foreground">gear icon</strong> (⚙️) in the top right</li>
                    <li>Select <strong className="text-foreground">"View all Outlook settings"</strong></li>
                    <li>Click <strong className="text-foreground">"Mail"</strong> → <strong className="text-foreground">"Rules"</strong></li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Create a New Rule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Click <strong className="text-foreground">"Add new rule"</strong></li>
                    <li>Give your rule a name: <strong className="text-foreground">"Forward Subscription Receipts"</strong></li>
                    <li>Under <strong className="text-foreground">"Add a condition"</strong>, select <strong className="text-foreground">"Subject includes"</strong></li>
                    <li>Enter: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">Receipt</code> or <code className="bg-muted px-2 py-1 rounded text-xs font-mono">Invoice</code></li>
                    <li>Click <strong className="text-foreground">"Add another condition"</strong> and select <strong className="text-foreground">"Subject or body includes"</strong></li>
                    <li>Enter subscription service names: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">Netflix, Disney, Spotify, Amazon, Apple, Microsoft</code></li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 3: Set Up Forwarding Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Under <strong className="text-foreground">"Add an action"</strong>, select <strong className="text-foreground">"Forward to"</strong></li>
                    <li>Enter: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">track@sub.prashikshit.dev</code></li>
                    <li>Click <strong className="text-foreground">"Save"</strong></li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Outlook allows you to add multiple conditions. You can create separate rules for different 
                    subscription services or combine them into one rule with multiple conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* General Information */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">✅ What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Once set up, subscription receipts will automatically forward to <code className="bg-muted px-2 py-1 rounded text-xs font-mono">track@sub.prashikshit.dev</code></li>
                <li>Your dashboard will automatically update with new subscriptions</li>
                <li>You can still manually forward emails if needed - both methods work!</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <DialogClose onClick={() => onOpenChange(false)}>
            Got it!
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SetupWizard;

