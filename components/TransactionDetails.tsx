import React from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDateTime } from '../lib/utils';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { AlertTriangle } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  onClose?: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-border/50 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium text-pretty">{value}</span>
  </div>
);

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const { createManualAlert } = useAppContext();
  
  if (!transaction) return null;

  const handleCreateAlert = () => {
    if (transaction) {
      createManualAlert(transaction.id);
      onClose?.(); // Close the drawer after creating the alert
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-base mb-2">Transaction Summary</h3>
        <DetailRow label="Transaction ID" value={<span className="font-mono text-xs">{transaction.transactionId}</span>} />
        <DetailRow label="Timestamp" value={formatDateTime(transaction.timestamp)} />
        <DetailRow label="Amount" value={formatCurrency(transaction.amount, transaction.currency)} />
        <DetailRow label="Status" value={<span className="capitalize">{transaction.status.replace('_', ' ')}</span>} />
        <DetailRow label="Channel" value={<span className="capitalize">{transaction.channel}</span>} />
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2">Merchant & Customer</h3>
        <DetailRow label="Merchant Name" value={transaction.merchantName} />
        <DetailRow label="Merchant Category" value={transaction.merchantCategory} />
        <DetailRow label="Customer ID" value={transaction.customerId} />
        <DetailRow label="Source Country" value={transaction.sourceCountry} />
        <DetailRow label="Destination Country" value={transaction.destinationCountry} />
      </div>
      
      <div>
        <h3 className="font-semibold text-base mb-2">Risk Analysis</h3>
        <DetailRow label="Risk Score" value={transaction.riskScore} />
        <DetailRow label="Risk Level" value={<Badge type="risk" value={transaction.riskLevel}>{transaction.riskLevel}</Badge>} />
        {transaction.triggeredRules && transaction.triggeredRules.length > 0 && (
          <div className="pt-3">
             <span className="text-muted-foreground text-sm">Triggered Rules</span>
             <div className="flex flex-wrap gap-2 mt-2 justify-end">
                {transaction.triggeredRules.map(rule => (
                    <span key={rule} className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">{rule}</span>
                ))}
             </div>
          </div>
        )}
      </div>

      {!transaction.alertId && (
        <div className="pt-4 mt-4 border-t border-border">
          <Button onClick={handleCreateAlert} className="w-full">
            <AlertTriangle size={16} className="mr-2" />
            Create Manual Alert
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;