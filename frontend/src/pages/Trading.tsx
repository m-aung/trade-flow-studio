import React, { useState } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import LoadingButton from '../components/ui/LoadingButton';
import Tooltip from '../components/ui/Tooltip';
import Dropdown from '../components/ui/Dropdown';
import Tabs from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast/ToastContext';

interface TradeForm {
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: string;
  price: string;
}

const Trading: React.FC = () => {
  const [form, setForm] = useState<TradeForm>({
    symbol: 'BTC-USD',
    type: 'BUY',
    quantity: '',
    price: '',
  });

  const { sendMessage } = useWebSocketContext();
  const { showToast } = useToast();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmTrade = async () => {
    setIsSubmitting(true);
    try {
      sendMessage('newTrade', {
        ...form,
        quantity: parseFloat(form.quantity),
        price: parseFloat(form.price),
      });
      setShowConfirmModal(false);
      showToast({
        type: 'success',
        title: 'Trade Placed',
        message: 'Your trade has been successfully placed.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Trade Failed',
        message: 'Failed to place trade. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const symbolOptions = [
    { value: 'BTC-USD', label: 'BTC/USD' },
    { value: 'ETH-USD', label: 'ETH/USD' },
  ];

  const typeOptions = [
    { value: 'BUY', label: 'Buy' },
    { value: 'SELL', label: 'Sell' },
  ];

  const orderTabs = [
    {
      id: 'market',
      label: 'Market Order',
      content: (
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Symbol"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              options={symbolOptions}
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'BUY' | 'SELL' })}
              options={typeOptions}
            />
            <Input
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              step="0.00000001"
              min="0"
              required
            />
            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              step="0.01"
              min="0"
              required
            />
            <LoadingButton
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              loadingText="Placing Order..."
            >
              Place Order
            </LoadingButton>
          </form>
        </div>
      ),
    },
    {
      id: 'limit',
      label: 'Limit Order',
      content: (
        <div className="space-y-4">
          <p>Limit order form coming soon...</p>
        </div>
      ),
    },
  ];

  const accountActions = [
    { label: 'Deposit', value: 'deposit', icon: '💰' },
    { label: 'Withdraw', value: 'withdraw', icon: '💸' },
    { label: 'History', value: 'history', icon: '📜' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Trading</h1>
        <Dropdown
          trigger={
            <Button variant="secondary">
              Account Actions
            </Button>
          }
          items={accountActions}
          onSelect={(value) => console.log('Selected:', value)}
        />
      </div>
      
      {showSuccessAlert && (
        <Alert
          variant="success"
          message="Trade placed successfully!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Place Order">
          <div className="mb-4">
            <Tooltip content="Your available balance for trading">
              <Badge variant="info" size="lg">
                Current Balance: $10,000
              </Badge>
            </Tooltip>
          </div>
          
          <Tabs tabs={orderTabs} defaultTab="market" />
        </Card>

        <Card title="Recent Orders" className="lg:max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {/* Add recent orders list here */}
            <p className="text-gray-500 dark:text-gray-400">No recent orders</p>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Trade"
      >
        <div className="space-y-4">
          <p>Please confirm your trade:</p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500 dark:text-gray-400">Symbol:</div>
              <div className="text-gray-900 dark:text-white">{form.symbol}</div>
              <div className="text-gray-500 dark:text-gray-400">Type:</div>
              <div className="text-gray-900 dark:text-white">{form.type}</div>
              <div className="text-gray-500 dark:text-gray-400">Quantity:</div>
              <div className="text-gray-900 dark:text-white">{form.quantity}</div>
              <div className="text-gray-500 dark:text-gray-400">Price:</div>
              <div className="text-gray-900 dark:text-white">${form.price}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmTrade}
              className="w-full sm:w-auto"
            >
              Confirm Trade
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trading; 