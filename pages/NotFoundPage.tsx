
import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Frown className="h-24 w-24 text-primary mb-4" />
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl text-muted-foreground mt-2 mb-6">Page Not Found</p>
      <Link to="/">
        <Button>Go Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;