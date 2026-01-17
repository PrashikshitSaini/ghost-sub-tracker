import React from 'react';
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
import { Card, CardContent } from './ui/card';

function WelcomeAlert({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Welcome to Ghost Sub Tracker!
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            We're excited to help you track your subscriptions!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Weekly Email Updates
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a weekly email summary of all your subscriptions, including upcoming renewals and total monthly spend. This helps you stay on top of your recurring expenses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">What to expect:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Weekly summary of all active subscriptions</li>
              <li>Upcoming renewal dates</li>
              <li>Total monthly spending overview</li>
              <li>Notifications about new subscriptions detected</li>
            </ul>
          </div>
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

export default WelcomeAlert;
