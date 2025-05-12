
import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, Copy, Download, Plus, Share2, Users } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ExpenseList from '@/components/expenses/ExpenseList';
import BalanceSummary from '@/components/balances/BalanceSummary';
import SettlementPlan from '@/components/balances/SettlementPlan';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi, expenseApi } from '@/services/apiService';
import { toast } from '@/components/ui/sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('expenses');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  // Redirect to login if not authenticated
  if (!user || !token || !groupId) {
    return <Navigate to="/login" replace />;
  }
  
  // Fetch group details
  const {
    data: group,
    isLoading: isLoadingGroup
  } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupApi.getGroup(groupId),
  });
  
  // Fetch group expenses
  const {
    data: expenses = [],
    isLoading: isLoadingExpenses
  } = useQuery({
    queryKey: ['expenses', groupId],
    queryFn: () => expenseApi.getExpenses(groupId),
  });
  
  // Fetch group balances
  const {
    data: balances = [],
    isLoading: isLoadingBalances
  } = useQuery({
    queryKey: ['balances', groupId],
    queryFn: () => groupApi.getBalances(groupId),
  });
  
  // Fetch settlement plan
  const {
    data: settlements = [],
    isLoading: isLoadingSettlements
  } = useQuery({
    queryKey: ['settlements', groupId],
    queryFn: () => groupApi.getSettlements(groupId),
  });
  
  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => expenseApi.deleteExpense(expenseId),
    onSuccess: () => {
      // Invalidate and refetch expenses and balances
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
      queryClient.invalidateQueries({ queryKey: ['settlements', groupId] });
      toast('Expense deleted', {
        description: 'The expense has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast('Error deleting expense', {
        description: error.response?.data?.message || 'An error occurred while deleting the expense.',
      });
    },
  });
  
  const handleDeleteExpense = (expenseId: string) => {
    deleteExpenseMutation.mutate(expenseId);
  };
  
  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode)
        .then(() => toast('Invite code copied to clipboard'))
        .catch(() => toast('Failed to copy invite code'));
    }
  };
  
  const exportExpenses = () => {
    // Use standard link opening in a new tab to handle auth
    const exportUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/expenses/group/${groupId}/export`;
    const token = localStorage.getItem('token');
    
    // Create a temporary link with auth token
    const link = document.createElement('a');
    link.href = exportUrl;
    link.setAttribute('target', '_blank');
    link.setAttribute('download', `expenses-${group?.name || 'group'}-${Date.now()}.csv`);
    
    // Append to body and click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    toast('Exporting expenses', {
      description: 'Your expense data is being downloaded as a CSV file.',
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader title={group?.name || 'Group Details'} />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/groups">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Groups
              </Button>
            </Link>
          </div>
          
          {isLoadingGroup ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/3 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded"></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{group?.name}</h1>
                  <Badge variant="outline">{group?.defaultCurrency}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {group?.description || 'No description provided'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
                <Button variant="outline" size="sm" onClick={exportExpenses}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Link to={`/groups/${groupId}/expenses/new`}>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b mb-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="expenses" className="flex-1 sm:flex-none">Expenses</TabsTrigger>
                <TabsTrigger value="balances" className="flex-1 sm:flex-none">Balances</TabsTrigger>
                <TabsTrigger value="settlement" className="flex-1 sm:flex-none">Settlement</TabsTrigger>
                <TabsTrigger value="members" className="flex-1 sm:flex-none">Members</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="expenses" className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Expenses</h2>
                <Link to={`/groups/${groupId}/expenses/new`}>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
              </div>
              
              <ExpenseList 
                expenses={expenses} 
                isLoading={isLoadingExpenses} 
                onDelete={handleDeleteExpense} 
                groupId={groupId}
              />
            </TabsContent>
            
            <TabsContent value="balances" className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Balances</h2>
                <p className="text-muted-foreground">
                  Track who owes what in the group
                </p>
              </div>
              
              <BalanceSummary 
                balances={balances} 
                isLoading={isLoadingBalances} 
                currency={group?.defaultCurrency || 'USD'}
              />
            </TabsContent>
            
            <TabsContent value="settlement" className="animate-fade-in">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Settlement Plan</h2>
                <p className="text-muted-foreground">
                  The most efficient way to settle all debts
                </p>
              </div>
              
              <SettlementPlan 
                settlements={settlements} 
                isLoading={isLoadingSettlements}
              />
            </TabsContent>
            
            <TabsContent value="members" className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Group Members</h2>
                <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              </div>
              
              {isLoadingGroup ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {group?.members?.map((member: any) => (
                    <div key={member.user._id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={member.user.avatar} alt={member.user.name} />
                          <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.user._id === user.id ? `${member.user.name} (You)` : member.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                      <Badge variant={member.role === 'admin' ? 'default' : 'outline'}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Share this invite code with people you want to add to this group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
              <Users className="h-12 w-12 text-primary mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Group Invite Code</p>
              <div className="text-xl font-mono font-bold tracking-widest mb-4">
                {group?.inviteCode}
              </div>
              <Button variant="outline" onClick={copyInviteCode}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">How to join:</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Share this code with your friends</li>
                <li>They should sign up for BudgetSplit if they haven't already</li>
                <li>They can enter this code in the "Join Group" section</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupDetailPage;
