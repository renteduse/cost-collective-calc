
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

const AuthPage: React.FC = () => {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="h-16 flex items-center px-6 border-b bg-background">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">BudgetSplit</h1>
        </Link>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BudgetSplit. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AuthPage;
