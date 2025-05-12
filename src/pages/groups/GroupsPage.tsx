
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GroupList from '@/components/groups/GroupList';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { groupApi } from '@/services/apiService';

const GroupsPage: React.FC = () => {
  const { user, token } = useAuth();
  
  // Redirect to login if not authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  // Fetch user's groups
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: groupApi.getGroups,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader title="My Groups" />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Groups</h1>
              <p className="text-muted-foreground mt-1">
                Manage your expense groups and view shared balances.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Link to="/groups/join">
                <Button variant="outline">Join Existing</Button>
              </Link>
              <Link to="/groups/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </Link>
            </div>
          </div>
          
          <GroupList groups={groups} isLoading={isLoadingGroups} />
        </div>
      </main>
    </div>
  );
};

export default GroupsPage;
