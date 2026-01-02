import React, { useState, useEffect } from 'react';
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

function EditSubscription({ open, onOpenChange, subscription, onSave, token }) {
  const [formData, setFormData] = useState({
    merchant: '',
    cost: '',
    renewal_date: '',
    status: 'Active'
  });
  const [originalRenewalDate, setOriginalRenewalDate] = useState('');
  const [renewalDateChanged, setRenewalDateChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (subscription) {
      const originalDate = subscription.renewal_date || '';
      setOriginalRenewalDate(originalDate);
      setRenewalDateChanged(false);
      setFormData({
        merchant: subscription.merchant || subscription.sub_name || '',
        cost: subscription.cost || '',
        renewal_date: originalDate,
        status: subscription.status || 'Active'
      });
      setError(null);
    }
  }, [subscription, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Track if renewal_date was changed from original
    if (name === 'renewal_date') {
      setRenewalDateChanged(value !== originalRenewalDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the update payload
      // CRITICAL: Always preserve original renewal_date format to match database exactly
      // This ensures DynamoDB can find and update the existing item instead of creating a new one
      // If user changed the date, we still send original format to prevent duplicate creation
      // The backend should handle date value updates separately if needed
      const updateData = {
        ...subscription, // Keep ALL original data (including original renewal_date format)
        merchant: formData.merchant,
        cost: parseFloat(formData.cost) || 0,
        renewal_date: originalRenewalDate, // ALWAYS use original format for exact database match
        status: formData.status
      };
      
      // If user changed the renewal_date value, include it as a separate field for backend processing
      if (renewalDateChanged && formData.renewal_date !== originalRenewalDate) {
        updateData.new_renewal_date = formData.renewal_date; // New value in user's format
      }

      // Call the onSave callback with updated data
      await onSave(updateData, token);
      
      // Close dialog on success
      onOpenChange(false);
    } catch (err) {
      console.error('Error updating subscription:', err);
      // Show backend error message to user
      const errorMessage = err.message || 'Failed to update subscription';
      setError(errorMessage);
      // Don't close dialog so user can see the error and try again
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update the subscription details. Leave fields empty if data is missing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="merchant" className="block text-sm font-medium mb-1">
                Merchant Name
              </label>
              <input
                type="text"
                id="merchant"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Netflix, Spotify"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium mb-1">
                Monthly Cost ($)
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="renewal_date" className="block text-sm font-medium mb-1">
                Next Renewal Date
              </label>
              <input
                type="text"
                id="renewal_date"
                name="renewal_date"
                value={formData.renewal_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., 2024-12-15 or Dec 15, 2024"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {originalRenewalDate && !renewalDateChanged ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    ⚠️ Keep the original format ({originalRenewalDate}) to update existing subscription. 
                    Changing the format may create a duplicate entry.
                  </span>
                ) : (
                  'Enter date in the same format as stored in database to update existing subscription'
                )}
              </p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Paused">Paused</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-4">
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose onClick={() => onOpenChange(false)}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSubscription;

