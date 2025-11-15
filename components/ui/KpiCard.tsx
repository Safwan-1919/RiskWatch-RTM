
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, description, className }) => {
  return (
    <Card className={cn("transition-all hover:shadow-lg hover:-translate-y-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
