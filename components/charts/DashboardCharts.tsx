
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Transaction, RiskLevel } from '../../types';

interface DashboardChartsProps {
  transactions: Transaction[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ transactions }) => {
  const riskDistribution = useMemo(() => {
    const distribution: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    transactions.forEach(t => {
      distribution[t.riskLevel]++;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const transactionsOverTime = useMemo(() => {
    const data: Record<string, { name: string; transactions: number }> = {};
    const now = new Date();
    transactions.forEach(t => {
        const timestamp = new Date(t.timestamp);
        if (now.getTime() - timestamp.getTime() < 1000 * 3600 * 24) { // Last 24 hours
            const hour = timestamp.getHours().toString().padStart(2, '0') + ":00";
            if (!data[hour]) data[hour] = { name: hour, transactions: 0 };
            data[hour].transactions++;
        }
    });
    return Object.values(data).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Transactions per Hour (Last 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="transactions" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
