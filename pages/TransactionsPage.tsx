import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { Transaction, TransactionFilters } from '../types';
import { formatCurrency, formatDateTime } from '../lib/utils';
import Drawer from '../components/ui/Drawer';
import TransactionDetails from '../components/TransactionDetails';
import TransactionFiltersComponent from '../components/filters/TransactionFilters';
import { Search } from 'lucide-react';

const initialFiltersState: TransactionFilters = {
  timeRange: 'all',
  riskLevels: [],
  channels: [],
  minAmount: '',
  maxAmount: '',
  sourceCountry: '',
  destinationCountry: '',
  statuses: [],
};

const TransactionsPage: React.FC = () => {
  const { transactions, isLoading } = useAppContext();
  const [filters, setFilters] = useState<TransactionFilters>(initialFiltersState);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const allCountries = useMemo(() => {
    const countries = new Set<string>();
    transactions.forEach(t => {
      countries.add(t.sourceCountry);
      countries.add(t.destinationCountry);
    });
    return Array.from(countries).sort();
  }, [transactions]);
  
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        // Search filter
        if (debouncedSearchTerm) {
          const lowercasedTerm = debouncedSearchTerm.toLowerCase();
          const searchableFields = [
            t.transactionId.toLowerCase(),
            t.customerId.toLowerCase(),
            t.merchantName.toLowerCase(),
          ];
          if (!searchableFields.some(field => field.includes(lowercasedTerm))) {
            return false;
          }
        }

        // Time Range filter
        if (filters.timeRange !== 'all') {
          const now = Date.now();
          const transactionDate = new Date(t.timestamp).getTime();
          let hours = 24;
          if (filters.timeRange === '7d') hours = 24 * 7;
          if (filters.timeRange === '30d') hours = 24 * 30;
          if (now - transactionDate > hours * 60 * 60 * 1000) {
            return false;
          }
        }

        // Risk Level filter
        if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(t.riskLevel)) {
          return false;
        }

        // Channel filter
        if (filters.channels.length > 0 && !filters.channels.includes(t.channel)) {
          return false;
        }

        // Amount filter
        const minAmount = parseFloat(String(filters.minAmount));
        const maxAmount = parseFloat(String(filters.maxAmount));
        if (!isNaN(minAmount) && t.amount < minAmount) {
          return false;
        }
        if (!isNaN(maxAmount) && t.amount > maxAmount) {
          return false;
        }

        // Source Country filter
        if (filters.sourceCountry && t.sourceCountry !== filters.sourceCountry) {
          return false;
        }

        // Destination Country filter
        if (filters.destinationCountry && t.destinationCountry !== filters.destinationCountry) {
          return false;
        }
        
        // Status filter
        if (filters.statuses.length > 0 && !filters.statuses.includes(t.status)) {
            return false;
        }

        return true;
      })
      .slice(0, 200); // Limit for performance
  }, [transactions, filters, debouncedSearchTerm]);

  const columns = [
    { header: 'Time', accessor: (item: Transaction) => <span className="text-muted-foreground text-xs">{formatDateTime(item.timestamp)}</span> },
    { header: 'Transaction ID', accessor: (item: Transaction) => <span className="font-mono text-xs">{item.transactionId}</span> },
    { header: 'Customer ID', accessor: (item: Transaction) => item.customerId },
    { header: 'Merchant', accessor: (item: Transaction) => item.merchantName },
    { header: 'Amount', accessor: (item: Transaction) => <div className="text-right w-full">{formatCurrency(item.amount, item.currency)}</div> },
    { header: 'Risk Score', accessor: (item: Transaction) => <div className="text-center w-full">{item.riskScore}</div> },
    { header: 'Risk Level', accessor: (item: Transaction) => <Badge type="risk" value={item.riskLevel}>{item.riskLevel}</Badge> },
    { header: 'Status', accessor: (item: Transaction) => <span className="capitalize">{item.status.replace('_', ' ')}</span> },
  ];

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDrawerClose = () => {
    setSelectedTransaction(null);
  };

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters(initialFiltersState);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TransactionFiltersComponent 
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              initialFilters={filters}
              allCountries={allCountries}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Transaction ID, Customer, or Merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <DataTable
              data={filteredTransactions}
              columns={columns}
              isLoading={isLoading}
              title="transactions"
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
      
      <Drawer
        isOpen={!!selectedTransaction}
        onClose={handleDrawerClose}
        title="Transaction Details"
      >
        <TransactionDetails 
          transaction={selectedTransaction}
          onClose={handleDrawerClose} 
        />
      </Drawer>
    </>
  );
};

export default TransactionsPage;
