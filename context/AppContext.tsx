
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Transaction, Alert, KpiData } from '../types';
import { useSocket, generateMockTransaction } from './SocketContext';

// MOCK DATA AND API SIMULATION
const MOCK_USERS: Record<string, User> = {
    'analyst@riskwatch.com': { id: 'user-1', name: 'Alex Ray', email: 'analyst@riskwatch.com', role: 'analyst', status: 'active', createdAt: new Date().toISOString() },
    'admin@riskwatch.com': { id: 'user-2', name: 'Jane Doe', email: 'admin@riskwatch.com', role: 'admin', status: 'active', createdAt: new Date().toISOString() },
};


const INITIAL_TRANSACTIONS = Array.from({ length: 200 }, (_, i) => generateMockTransaction(i + 1, false));
const INITIAL_ALERTS: Alert[] = [];
INITIAL_TRANSACTIONS.forEach((t, i) => {
    if (t.riskLevel === 'high' || t.riskLevel === 'critical') {
        const alertId = `alert-${INITIAL_ALERTS.length + 1}`;
        t.alertId = alertId;
        INITIAL_ALERTS.push({
            id: alertId,
            alertId: `A${Date.now()}${i+1}`,
            transactionRef: t.id,
            title: `High Risk Transaction: ${t.merchantName}`,
            description: `Transaction of ${t.amount} ${t.currency} flagged with risk score ${t.riskScore}.`,
            riskScore: t.riskScore,
            riskLevel: t.riskLevel,
            status: 'open',
            tags: t.triggeredRules || [],
            createdAt: t.timestamp,
            timeline: [{ at: t.timestamp, actor: 'System', action: 'Alert Created' }]
        });
    }
});


// CONTEXT DEFINITION
interface AppContextType {
  user: User | null;
  login: (email: string) => Promise<User>;
  logout: () => void;
  transactions: Transaction[];
  alerts: Alert[];
  kpis: KpiData;
  isLoading: boolean;
  createManualAlert: (transactionId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  const kpis = useMemo<KpiData>(() => {
    const recentTxns = transactions.filter(t => new Date(t.timestamp) > new Date(Date.now() - 1000 * 3600 * 24));
    return {
        totalTransactions: recentTxns.length,
        openAlerts: alerts.filter(a => a.status === 'open' || a.status === 'in_progress').length,
        highRiskTransactions: recentTxns.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical').length,
        avgRiskScore: recentTxns.length > 0 ? Math.round(recentTxns.reduce((sum, t) => sum + t.riskScore, 0) / recentTxns.length) : 0
    };
  }, [transactions, alerts]);

  // Simulate API login
  const login = useCallback(async (email: string): Promise<User> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS[email.toLowerCase()];
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('riskwatch_user', JSON.stringify(foundUser));
          resolve(foundUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
        setIsLoading(false);
      }, 1000);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('riskwatch_user');
  }, []);

  const createManualAlert = useCallback((transactionId: string) => {
    setTransactions(prevTxns => {
      const newTxns = [...prevTxns];
      const txnIndex = newTxns.findIndex(t => t.id === transactionId);
      
      if (txnIndex === -1 || newTxns[txnIndex].alertId) {
        return prevTxns; // Transaction not found or already has an alert
      }

      const transaction = newTxns[txnIndex];
      
      const newAlertId = `alert-${alerts.length + 1}`;
      transaction.alertId = newAlertId;
      transaction.status = 'under_review';

      const newAlert: Alert = {
        id: newAlertId,
        alertId: `A${Date.now()}${alerts.length + 1}`,
        transactionRef: transaction.id,
        title: `Manual Alert: ${transaction.merchantName}`,
        description: `Alert manually created for transaction of ${transaction.amount} ${transaction.currency}.`,
        riskScore: transaction.riskScore,
        riskLevel: transaction.riskLevel,
        status: 'open',
        tags: ['manual_review', ...(transaction.triggeredRules || [])],
        createdAt: new Date().toISOString(),
        timeline: [
          { at: transaction.timestamp, actor: 'System', action: 'Transaction Occurred' },
          { at: new Date().toISOString(), actor: user?.name || 'Analyst', action: 'Manual Alert Created' }
        ]
      };
      
      setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
      return newTxns;
    });
  }, [alerts.length, user]);


  // Check for logged in user on mount
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('riskwatch_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
    }
    setIsLoading(false);
  }, []);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewTransaction = (newTxn: Transaction) => {
      setTransactions(prev => [newTxn, ...prev]);
    };

    const handleNewAlert = (newAlert: Alert) => {
      setAlerts(prev => [newAlert, ...prev]);
    };

    socket.on('new_transaction', handleNewTransaction);
    socket.on('new_alert', handleNewAlert);

    return () => {
      socket.off('new_transaction', handleNewTransaction);
      socket.off('new_alert', handleNewAlert);
    };
  }, [socket]);

  const value = { user, login, logout, transactions, alerts, kpis, isLoading, createManualAlert };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
