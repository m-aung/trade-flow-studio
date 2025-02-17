import React from 'react';
import { useTradeUpdates } from '../hooks/useTradeUpdates';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Portfolio: React.FC = () => {
  const trades = useTradeUpdates();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio</h1>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {trades.map((trade) => (
                  <tr key={trade.trade_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {trade.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {trade.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {trade.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      ${trade.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(trade.status)}>
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {trades.map((trade) => (
          <Card key={trade.trade_id}>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {trade.symbol}
                </div>
                <Badge variant={getStatusBadgeVariant(trade.status)}>
                  {trade.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Type:</div>
                <div className="text-gray-900 dark:text-gray-300">{trade.type}</div>
                <div className="text-gray-500 dark:text-gray-400">Quantity:</div>
                <div className="text-gray-900 dark:text-gray-300">{trade.quantity}</div>
                <div className="text-gray-500 dark:text-gray-400">Price:</div>
                <div className="text-gray-900 dark:text-gray-300">${trade.price}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {trades.length === 0 && (
        <Card>
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">No trades found</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Portfolio; 