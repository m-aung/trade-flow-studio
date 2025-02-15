import React, { useState } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage('newTrade', {
      ...form,
      quantity: parseFloat(form.quantity),
      price: parseFloat(form.price),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trading</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Symbol</label>
            <select
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="BTC-USD">BTC/USD</option>
              <option value="ETH-USD">ETH/USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'BUY' | 'SELL' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              step="0.00000001"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              step="0.01"
              min="0"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Trading; 