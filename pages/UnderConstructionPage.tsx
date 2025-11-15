
import React from 'react';
import { Wrench } from 'lucide-react';

interface UnderConstructionPageProps {
  title: string;
}

const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Wrench className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-lg text-muted-foreground">This page is under construction.</p>
      <p className="text-sm text-muted-foreground mt-2">Check back soon for updates!</p>
    </div>
  );
};

export default UnderConstructionPage;
