
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Transaction, Alert, RiskLevel } from '../types';

// Data generation constants and function
const ALL_COUNTRIES = ["USA", "GBR", "IND", "CHN", "BRA", "RUS", "NGA", "DEU", "FRA", "JPN"];
const ALL_MERCHANTS = ["Amazon", "Walmart", "Apple", "Netflix", "ExxonMobil", "CryptoExchange", "Offshore Services Ltd"];
const ALL_MERCHANT_CATEGORIES = ["E-commerce", "Retail", "Technology", "Entertainment", "Energy", "Financial Services", "Professional Services"];

export const generateMockTransaction = (id: number, isRealtime: boolean = false): Transaction => {
    const amount = Math.random() * 5000;
    const riskScore = Math.floor(Math.random() * 101);
    let riskLevel: RiskLevel = 'low';
    if (riskScore > 80) riskLevel = 'critical';
    else if (riskScore > 60) riskLevel = 'high';
    else if (riskScore > 30) riskLevel = 'medium';

    const sourceCountry = ALL_COUNTRIES[Math.floor(Math.random() * ALL_COUNTRIES.length)];
    const destinationCountry = ALL_COUNTRIES[Math.floor(Math.random() * ALL_COUNTRIES.length)];
    const merchantName = ALL_MERCHANTS[Math.floor(Math.random() * ALL_MERCHANTS.length)];

    const triggeredRules: string[] = [];
    if (amount > 4000) triggeredRules.push('HIGH_AMOUNT');
    if (sourceCountry !== destinationCountry && Math.random() > 0.5) triggeredRules.push('GEO_MISMATCH');
    if (merchantName.toLowerCase().includes('crypto') || merchantName.toLowerCase().includes('offshore')) triggeredRules.push('HIGH_RISK_MERCHANT');
    if (riskScore > 80) triggeredRules.push('CRITICAL_SCORE');

    return {
        id: `txn-${id}`,
        transactionId: `T${Date.now()}${id}`,
        amount,
        currency: 'USD',
        timestamp: isRealtime 
            ? new Date().toISOString() 
            : new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 30).toISOString(),
        channel: ['card', 'upi', 'netbanking', 'wallet'][Math.floor(Math.random() * 4)] as any,
        merchantName,
        merchantCategory: ALL_MERCHANT_CATEGORIES[Math.floor(Math.random() * ALL_MERCHANT_CATEGORIES.length)],
        sourceCountry,
        destinationCountry,
        customerId: `CUST${1000 + Math.floor(Math.random() * 9000)}`,
        riskScore,
        riskLevel,
        status: riskLevel === 'high' || riskLevel === 'critical' ? 'flagged' : 'normal',
        triggeredRules,
    };
};


type EventCallback = (data: any) => void;
type Listeners = {
  [key: string]: EventCallback[];
};

interface SocketContextType {
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback: EventCallback) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listeners = useRef<Listeners>({});
  const [transactionCounter, setTransactionCounter] = useState(201); // Start after initial 200
  const [alertCounter, setAlertCounter] = useState(100); // Rough starting point

  const on = useCallback((event: string, callback: EventCallback) => {
    if (!listeners.current[event]) {
      listeners.current[event] = [];
    }
    listeners.current[event].push(callback);
  }, []);

  const off = useCallback((event: string, callback: EventCallback) => {
    if (listeners.current[event]) {
      listeners.current[event] = listeners.current[event].filter(cb => cb !== callback);
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (listeners.current[event]) {
      listeners.current[event].forEach(callback => callback(data));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTxnId = transactionCounter;
      const newTxn = generateMockTransaction(newTxnId, true);
      
      let newAlert: Alert | null = null;
      if (newTxn.riskLevel === 'high' || newTxn.riskLevel === 'critical') {
        const newAlertIdNumber = alertCounter;
        const newAlertId = `alert-${newAlertIdNumber}`;
        newTxn.alertId = newAlertId; 

        newAlert = {
          id: newAlertId,
          alertId: `A${Date.now()}${newAlertIdNumber}`,
          transactionRef: newTxn.id,
          title: `High Risk Transaction: ${newTxn.merchantName}`,
          description: `Transaction of ${newTxn.amount} ${newTxn.currency} flagged with risk score ${newTxn.riskScore}.`,
          riskScore: newTxn.riskScore,
          riskLevel: newTxn.riskLevel,
          status: 'open',
          tags: newTxn.triggeredRules || [],
          createdAt: newTxn.timestamp,
          timeline: [{ at: newTxn.timestamp, actor: 'System', action: 'Alert Created' }]
        };
        setAlertCounter(prev => prev + 1);
      }
      
      emit('new_transaction', newTxn);

      if (newAlert) {
        emit('new_alert', newAlert);
      }
      
      setTransactionCounter(prev => prev + 1);
    }, 3000); 

    return () => clearInterval(interval);
  }, [transactionCounter, alertCounter, emit]);

  const value = { on, off };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
      throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
