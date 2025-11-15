
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { Alert, AlertStatus } from '../types';
import { formatDateTime } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const AlertsPage: React.FC = () => {
  const { alerts, isLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState<AlertStatus | 'all'>('all');

  const filteredAlerts = useMemo(() => {
    if (activeTab === 'all') return alerts;
    return alerts.filter(a => a.status === activeTab);
  }, [alerts, activeTab]);

  const columns = [
    { header: 'Created At', accessor: (item: Alert) => <span className="text-muted-foreground text-xs">{formatDateTime(item.createdAt)}</span> },
    { header: 'Alert ID', accessor: (item: Alert) => <span className="font-mono text-xs">{item.alertId}</span> },
    { header: 'Title', accessor: (item: Alert) => item.title },
    { header: 'Risk Score', accessor: (item: Alert) => <div className="text-center w-full">{item.riskScore}</div> },
    { header: 'Risk Level', accessor: (item: Alert) => <Badge type="risk" value={item.riskLevel}>{item.riskLevel}</Badge> },
    { header: 'Status', accessor: (item: Alert) => <Badge type="alert" value={item.status}>{item.status.replace('_', ' ')}</Badge> },
    { header: 'Assigned To', accessor: (item: Alert) => item.assignedTo || <span className="text-muted-foreground">Unassigned</span> },
  ];

  const TABS: Array<AlertStatus | 'all'> = ['all', 'open', 'in_progress', 'closed', 'false_positive'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Alerts & Case Management</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>Alerts Queue</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="mb-4 border-b border-border">
                <div className="flex space-x-4">
                    {TABS.map(tab => (
                        <Button
                            key={tab}
                            variant="ghost"
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize rounded-none border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            {tab.replace('_', ' ')}
                        </Button>
                    ))}
                </div>
            </div>
            <DataTable
            data={filteredAlerts.slice(0, 100)}
            columns={columns}
            isLoading={isLoading}
            title="alerts"
            />
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;