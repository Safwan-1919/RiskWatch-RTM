
import React from 'react';
import { LayoutDashboard, List, ShieldAlert, FileText, BarChart2, Settings } from 'lucide-react';
import { RiskLevel, AlertStatus, TransactionStatus } from './types';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/transactions', label: 'Transactions', icon: <List size={20} /> },
  { href: '/alerts', label: 'Alerts', icon: <ShieldAlert size={20} /> },
  { href: '/rules', label: 'Rules & Watchlists', icon: <FileText size={20} /> },
  { href: '/analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  { href: '/admin', label: 'Admin', icon: <Settings size={20} /> },
];

export const RISK_LEVELS: RiskLevel[] = ['low', 'medium', 'high', 'critical'];

export const TRANSACTION_CHANNELS: ('card' | 'upi' | 'netbanking' | 'wallet' | 'other')[] = ['card', 'upi', 'netbanking', 'wallet', 'other'];

export const TRANSACTION_STATUSES: TransactionStatus[] = ['normal', 'flagged', 'under_review', 'blocked'];

export const RISK_LEVEL_STYLES: Record<RiskLevel, string> = {
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const ALERT_STATUS_STYLES: Record<AlertStatus, string> = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  false_positive: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};
