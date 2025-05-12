
import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { groupApi } from '@/services/apiService';
import { Plus, Users, CreditCard, ArrowRight } from 'lucide-react';
import GroupList, { Group } from '@/components/groups/GroupList';

const Dashboard: React.FC = () => {
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
      <DashboardHeader title="Dashboard" />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
              <p className="text-muted-foreground mt-1">
                Manage your shared expenses and track balances with friends.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Link to="/groups/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Groups</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-3xl font-bold">{groups?.length || 0}</div>
              </CardContent>
              <CardFooter>
                <Link to="/groups" className="text-sm text-primary flex items-center">
                  View all groups
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Balances</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-end space-x-1">
                  <div className="text-3xl font-bold">–</div>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-muted-foreground">
                  Select a group to view balances
                </span>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Currency</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-3xl font-bold">{user?.preferredCurrency || 'USD'}</div>
              </CardContent>
              <CardFooter>
                <Link to="/profile" className="text-sm text-primary flex items-center">
                  Update preference
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Groups</h2>
            <GroupList groups={groups.slice(0, 3)} isLoading={isLoadingGroups} />
          </div>
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <Link to="/groups" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                View All Groups
              </Button>
            </Link>
            
            <Link to="/groups/join" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Join Existing Group
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
