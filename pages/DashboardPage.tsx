
import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import KpiCard from '../components/ui/KpiCard';
import DashboardCharts from '../components/charts/DashboardCharts';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { Activity, AlertTriangle, ShieldCheck, Sigma } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDateTime } from '../lib/utils';

const DashboardPage: React.FC = () => {
  const { user, kpis, transactions, isLoading } = useAppContext();
  
  const highRiskTransactions = useMemo(() => {
    return transactions
      .filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical')
      .slice(0, 10);
  }, [transactions]);

  const columns = [
    { header: 'Time', accessor: (item: Transaction) => <span className="text-muted-foreground">{formatDateTime(item.timestamp)}</span> },
    { header: 'Transaction ID', accessor: (item: Transaction) => <span className="font-mono text-xs">{item.transactionId}</span> },
    { header: 'Customer', accessor: (item: Transaction) => item.customerId },
    { header: 'Amount', accessor: (item: Transaction) => formatCurrency(item.amount, item.currency) },
    { header: 'Risk Score', accessor: (item: Transaction) => item.riskScore },
    { header: 'Risk Level', accessor: (item: Transaction) => <Badge type="risk" value={item.riskLevel}>{item.riskLevel}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Transactions (24h)" value={kpis.totalTransactions} icon={<Activity />} />
        <KpiCard title="Open Alerts" value={kpis.openAlerts} icon={<AlertTriangle />} />
        <KpiCard title="High Risk Txns (24h)" value={kpis.highRiskTransactions} icon={<ShieldCheck />} />
        <KpiCard title="Avg. Risk Score (24h)" value={kpis.avgRiskScore} icon={<Sigma />} />
      </div>

      <DashboardCharts transactions={transactions} />

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent High-Risk Transactions</h2>
        <DataTable
          data={highRiskTransactions}
          columns={columns}
          isLoading={isLoading}
          title="transactions"
        />
      </div>
    </div>
  );
};

export default DashboardPage;