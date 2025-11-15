
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('analyst@riskwatch.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login(email);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password. Try analyst@riskwatch.com or admin@riskwatch.com');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
            </div>
          <CardTitle>Welcome to RiskWatch RTM</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="analyst@riskwatch.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="password123"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? <Spinner className="h-5 w-5" /> : 'Login'}
            </Button>
            <p className="text-xs text-center text-muted-foreground pt-2">
                Use `analyst@riskwatch.com` or `admin@riskwatch.com` with any password.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;