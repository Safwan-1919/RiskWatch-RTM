
import React from 'react';
import { cn } from '../../lib/utils';
import { RiskLevel, AlertStatus } from '../../types';
import { RISK_LEVEL_STYLES, ALERT_STATUS_STYLES } from '../../constants';

interface BadgeProps {
  type: 'risk' | 'alert';
  value: RiskLevel | AlertStatus;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ type, value, children }) => {
  const styles = type === 'risk' 
    ? RISK_LEVEL_STYLES[value as RiskLevel] 
    : ALERT_STATUS_STYLES[value as AlertStatus];
    
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border',
        styles
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
