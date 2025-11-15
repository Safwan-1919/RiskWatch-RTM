
import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '../types';
import Button from '../components/ui/Button';
import { Download } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const AnalyticsPage: React.FC = () => {
    const { transactions } = useAppContext();

    const riskScoreOverTime = useMemo(() => {
        const sorted = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return sorted.map(t => ({
            date: new Date(t.timestamp).toLocaleDateString(),
            riskScore: t.riskScore
        })).slice(-100); // show last 100 for clarity
    }, [transactions]);
    
    const transactionsByCountry = useMemo(() => {
        const counts: Record<string, number> = {};
        transactions.forEach(t => {
            counts[t.sourceCountry] = (counts[t.sourceCountry] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0,10);
    }, [transactions]);

    const transactionStatusDistribution = useMemo(() => {
        const distribution: Record<string, number> = {};
        transactions.forEach(t => {
          distribution[t.status] = (distribution[t.status] || 0) + 1;
        });
        return Object.entries(distribution).map(([name, value]) => ({ name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), value }));
      }, [transactions]);

      const topHighRiskCategories = useMemo(() => {
        const categories: Record<string, number> = {};
        transactions
            .filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical')
            .forEach(t => {
                categories[t.merchantCategory] = (categories[t.merchantCategory] || 0) + 1;
            });
        return Object.entries(categories).map(([name, count]) => ({name, count})).sort((a,b) => b.count - a.count).slice(0, 5);
      }, [transactions]);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            <div className="flex items-center space-x-2">
                <input type="date" className="px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                <span className="text-muted-foreground">to</span>
                <input type="date" className="px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                <Button variant="secondary"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
            </div>
        </div>
      
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={transactionStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {transactionStatusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top High-Risk Merchant Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topHighRiskCategories} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                            <Bar dataKey="count" fill="#FF8042" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Risk Score Trend</CardTitle>
                    <CardDescription>Average risk score of transactions over time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={riskScoreOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                        <Line type="monotone" dataKey="riskScore" stroke="#8884d8" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Top 10 Transaction Source Countries</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={transactionsByCountry}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                            <Bar dataKey="value" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default AnalyticsPage;
