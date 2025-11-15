
import React, { useState, useEffect } from 'react';
import { TransactionFilters, RiskLevel, TransactionStatus } from '../../types';
import { RISK_LEVELS, TRANSACTION_CHANNELS, TRANSACTION_STATUSES } from '../../constants';
import Button from '../ui/Button';

interface TransactionFiltersProps {
  onApplyFilters: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  initialFilters: TransactionFilters;
  allCountries: string[];
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({ onApplyFilters, onClearFilters, initialFilters, allCountries }) => {
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleMultiSelectChange = <T extends string>(field: keyof TransactionFilters, value: T) => {
    setFilters(prev => {
      const currentValues = (prev[field] as T[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg space-y-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold">Filters</h3>
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Time Range</label>
          <select name="timeRange" value={filters.timeRange} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Risk Level</label>
          <div className="space-y-2">
            {RISK_LEVELS.map(level => (
              <label key={level} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.riskLevels.includes(level)} onChange={() => handleMultiSelectChange('riskLevels', level)} className="h-4 w-4 rounded bg-input border-border text-primary focus:ring-ring" />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Channel */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Channel</label>
          <div className="space-y-2">
            {TRANSACTION_CHANNELS.map(channel => (
              <label key={channel} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.channels.includes(channel)} onChange={() => handleMultiSelectChange('channels', channel)} className="h-4 w-4 rounded bg-input border-border text-primary focus:ring-ring" />
                <span className="capitalize">{channel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Amount Range</label>
          <div className="flex items-center space-x-2">
            <input type="number" name="minAmount" placeholder="Min" value={filters.minAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-muted-foreground">-</span>
            <input type="number" name="maxAmount" placeholder="Max" value={filters.maxAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {/* Source Country */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Source Country</label>
          <select name="sourceCountry" value={filters.sourceCountry} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Any Country</option>
            {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Destination Country */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Destination Country</label>
          <select name="destinationCountry" value={filters.destinationCountry} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Any Country</option>
            {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
          <div className="space-y-2">
            {TRANSACTION_STATUSES.map(status => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.statuses.includes(status)} onChange={() => handleMultiSelectChange('statuses', status)} className="h-4 w-4 rounded bg-input border-border text-primary focus:ring-ring" />
                <span className="capitalize">{status.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex space-x-2">
          <Button onClick={handleApply} className="flex-1">Apply Filters</Button>
          <Button onClick={handleClear} variant="secondary" className="flex-1">Clear Filters</Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFiltersComponent;
