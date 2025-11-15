
import React, { useState } from 'react';
import DataTable from '../components/ui/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Rule, WatchlistItem } from '../types';
import { PlusCircle, Eye } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { cn } from '../lib/utils';

// Mock Data
const MOCK_RULES: Rule[] = [
  { id: 'rule-1', name: 'High Value Transaction', description: 'Flags transactions over $10,000.', condition: 'amount > 10000', action: 'flag', status: 'active', lastModified: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'rule-2', name: 'Sanctioned Country Block', description: 'Blocks transactions from sanctioned countries.', condition: "country IN ('IRN', 'PRK')", action: 'block', status: 'active', lastModified: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'rule-3', name: 'Rapid Velocity', description: 'Flags >5 transactions from same customer in 1 hour.', condition: 'COUNT(customerId) > 5 OVER 1h', action: 'flag', status: 'inactive', lastModified: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'rule-4', name: 'High-Risk Merchant Category', description: 'Flags transactions from gambling or crypto merchants.', condition: "merchantCategory IN ('Gambling', 'Crypto')", action: 'flag', status: 'active', lastModified: new Date(Date.now() - 86400000 * 1).toISOString() },
];

const MOCK_WATCHLIST: WatchlistItem[] = [
    { id: 'wl-1', type: 'customer_id', value: 'CUST8892', reason: 'Previous fraudulent activity', addedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'wl-2', type: 'merchant_name', value: 'ShadyDeals.com', reason: 'Reported by multiple users', addedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
    { id: 'wl-3', type: 'country', value: 'Somalia', reason: 'High-risk jurisdiction', addedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
];

const RulesPage: React.FC = () => {
    const [rules, setRules] = useState(MOCK_RULES);

    const toggleRuleStatus = (ruleId: string) => {
        setRules(prevRules =>
            prevRules.map(rule =>
                rule.id === ruleId
                    ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
                    : rule
            )
        );
    };

    const ruleColumns = [
        { header: 'Rule Name', accessor: (item: Rule) => <div className="font-semibold">{item.name}</div> },
        { header: 'Condition', accessor: (item: Rule) => <div className="font-mono text-xs bg-muted p-1 rounded">{item.condition}</div> },
        { header: 'Action', accessor: (item: Rule) => <span className="capitalize font-medium">{item.action}</span> },
        { header: 'Status', accessor: (item: Rule) => (
            <div className="flex items-center">
                <span className={cn('h-2 w-2 rounded-full mr-2', item.status === 'active' ? 'bg-green-500' : 'bg-gray-500')}></span>
                <span className="capitalize">{item.status}</span>
            </div>
        )},
        { header: 'Last Modified', accessor: (item: Rule) => formatDateTime(item.lastModified) },
        { header: 'Actions', accessor: (item: Rule) => (
            <Button
                variant={item.status === 'active' ? 'secondary' : 'default'}
                size="sm"
                onClick={() => toggleRuleStatus(item.id)}
            >
                {item.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
        )},
    ];

    const watchlistColumns = [
        { header: 'Type', accessor: (item: WatchlistItem) => <span className="capitalize">{item.type.replace('_', ' ')}</span> },
        { header: 'Value', accessor: (item: WatchlistItem) => <div className="font-mono text-sm">{item.value}</div> },
        { header: 'Reason', accessor: (item: WatchlistItem) => item.reason },
        { header: 'Added At', accessor: (item: WatchlistItem) => formatDateTime(item.addedAt) },
    ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rules & Watchlists</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Risk Rules Engine</CardTitle>
                <CardDescription>Define and manage transaction monitoring rules.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Rule
            </Button>
        </CardHeader>
        <CardContent>
            <DataTable
                data={rules}
                columns={ruleColumns}
                title="rules"
            />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Watchlists</CardTitle>
                <CardDescription>Monitor specific entities for suspicious activity.</CardDescription>
            </div>
            <Button variant="secondary">
                <Eye className="mr-2 h-4 w-4" /> Add to Watchlist
            </Button>
        </CardHeader>
        <CardContent>
             <DataTable
                data={MOCK_WATCHLIST}
                columns={watchlistColumns}
                title="watchlist items"
            />
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesPage;
