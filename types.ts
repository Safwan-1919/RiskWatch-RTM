
export type UserRole = 'admin' | 'analyst' | 'viewer';
export type UserStatus = 'active' | 'suspended';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TransactionStatus = 'normal' | 'flagged' | 'under_review' | 'blocked';
export type AlertStatus = 'open' | 'in_progress' | 'closed' | 'false_positive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: string;
  channel: 'card' | 'upi' | 'netbanking' | 'wallet' | 'other';
  merchantName: string;
  merchantCategory: string;
  sourceCountry: string;
  destinationCountry: string;
  customerId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TransactionStatus;
  alertId?: string;
  triggeredRules?: string[];
}

export interface Alert {
  id: string;
  alertId: string;
  transactionRef: string; // Transaction ID
  title: string;
  description: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: AlertStatus;
  assignedTo?: string; // User ID
  tags: string[];
  createdAt: string;
  timeline: AlertTimelineItem[];
}

export interface AlertTimelineItem {
  at: string;
  actor: string; // User name or 'System'
  action: string;
  notes?: string;
}

export interface KpiData {
  totalTransactions: number;
  openAlerts: number;
  highRiskTransactions: number;
  avgRiskScore: number;
}

export interface TransactionFilters {
  timeRange: 'all' | '24h' | '7d' | '30d';
  riskLevels: RiskLevel[];
  channels: ('card' | 'upi' | 'netbanking' | 'wallet' | 'other')[];
  minAmount?: number | '';
  maxAmount?: number | '';
  sourceCountry: string;
  destinationCountry: string;
  statuses: TransactionStatus[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'flag' | 'block' | 'allow';
  status: 'active' | 'inactive';
  lastModified: string;
}

export interface WatchlistItem {
  id: string;
  type: 'customer_id' | 'merchant_name' | 'ip_address' | 'country';
  value: string;
  reason: string;
  addedAt: string;
}
