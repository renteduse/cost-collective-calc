
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { useAuth } from '@/context/AuthContext';

const EditExpensePage: React.FC = () => {
  const { groupId, expenseId } = useParams<{ groupId: string; expenseId: string }>();
  const { user, token } = useAuth();
  
  // Redirect to login if not authenticated
  if (!user || !token || !groupId || !expenseId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader title="Edit Expense" />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to={`/groups/${groupId}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Group
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Expense</h1>
            <p className="text-muted-foreground mt-1">
              Update the details of this shared expense
            </p>
          </div>
          
          <ExpenseForm expenseId={expenseId} />
        </div>
      </main>
    </div>
  );
};

export default EditExpensePage;
