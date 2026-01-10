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
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../contexts/CurrencyContext';

function AddSubscription({ open, onOpenChange, onSave, token }) {
  const { getCurrencySymbol } = useCurrency();
  const [formData, setFormData] = useState({
    merchant: '',
    cost: '',
    renewal_date: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.merchant.trim()) {
      setError('Merchant name is required');
      setLoading(false);
      return;
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      setError('Monthly cost must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      // Prepare the new subscription payload matching Lambda expectations
      // Lambda will add: user_id, sub_name (from merchant), and original_msg_id (defaults to 'MANUAL_ADD')
      const newSubscription = {
        merchant: formData.merchant.trim(),
        cost: parseFloat(formData.cost) || 0,
        renewal_date: formData.renewal_date.trim() || '', // Lambda defaults to '1970-01-01' if empty
        status: formData.status || 'Active',
        original_msg_id: 'MANUAL_ADD' // Explicitly set for manual entries
      };

      // Call the onSave callback with new subscription data
      await onSave(newSubscription, token);
      
      // Reset form and close dialog on success
      setFormData({
        merchant: '',
        cost: '',
        renewal_date: '',
        status: 'Active'
      });
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Failed to add subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        merchant: '',
        cost: '',
        renewal_date: '',
        status: 'Active'
      });
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Manually add a subscription to track. Merchant name and cost are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="merchant" className="block text-sm font-medium mb-1">
                Merchant Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="merchant"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Netflix, Spotify"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium mb-1">
                Monthly Cost ({getCurrencySymbol()}) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
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
                Optional: Enter the next renewal date
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
            <DialogClose onClick={handleClose} disabled={loading}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSubscription;

