
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import { User, UserRole, UserStatus } from '../types';
import Button from '../components/ui/Button';
import { PlusCircle, Edit, ShieldOff } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import Badge from '../components/ui/Badge';

// Mock Data
const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Alex Ray', email: 'analyst@riskwatch.com', role: 'analyst', status: 'active', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
    { id: 'user-2', name: 'Jane Doe', email: 'admin@riskwatch.com', role: 'admin', status: 'active', createdAt: new Date(Date.now() - 86400000 * 90).toISOString() },
    { id: 'user-3', name: 'Sam Wilson', email: 'sam.w@riskwatch.com', role: 'analyst', status: 'active', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'user-4', name: 'Maria Hill', email: 'maria.h@riskwatch.com', role: 'viewer', status: 'active', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'user-5', name: 'John Smith', email: 'john.s@riskwatch.com', role: 'analyst', status: 'suspended', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
];

const SettingToggle: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex items-center justify-between p-4 border rounded-md border-border">
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    </div>
);


const AdminPage: React.FC = () => {
    
    const userColumns = [
        { header: 'Name', accessor: (item: User) => <div className="font-medium">{item.name}</div> },
        { header: 'Email', accessor: (item: User) => <div className="text-muted-foreground">{item.email}</div> },
        { header: 'Role', accessor: (item: User) => <span className="capitalize">{item.role}</span> },
        { header: 'Status', accessor: (item: User) => (
             <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {item.status}
            </span>
        )},
        { header: 'Created At', accessor: (item: User) => formatDateTime(item.createdAt) },
        { header: 'Actions', accessor: (item: User) => (
            <div className="flex space-x-2">
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive"><ShieldOff className="h-4 w-4" /></Button>
            </div>
        )},
    ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin & Settings</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Invite, remove, and manage user roles and permissions.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Invite User
            </Button>
        </CardHeader>
        <CardContent>
            <DataTable
                data={MOCK_USERS}
                columns={userColumns}
                title="users"
            />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure global settings for the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <SettingToggle 
                title="Enable Two-Factor Authentication (2FA)"
                description="Require all users to set up 2FA for enhanced security."
            />
            <SettingToggle 
                title="Automatic Case Creation"
                description="Automatically create a case for any alert with a 'Critical' risk level."
            />
             <SettingToggle 
                title="Session Timeout"
                description="Automatically log out users after 30 minutes of inactivity."
            />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
