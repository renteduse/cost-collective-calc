
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GroupForm from '@/components/groups/GroupForm';
import { useAuth } from '@/context/AuthContext';

const CreateGroupPage: React.FC = () => {
  const { user, token } = useAuth();
  
  // Redirect to login if not authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader title="Create Group" />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link to="/groups">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Groups
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
            <p className="text-muted-foreground mt-1">
              Create a group to track shared expenses with friends, roommates, or travel companions.
            </p>
          </div>
          
          <GroupForm />
        </div>
      </main>
    </div>
  );
};

export default CreateGroupPage;
