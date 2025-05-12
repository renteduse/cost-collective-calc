
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, CheckCircle, Clipboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { currencyApi } from '@/services/apiService';

export interface Settlement {
  from: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    preferredCurrency?: string;
  };
  to: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    preferredCurrency?: string;
  };
  amount: number;
  currency: string;
}

interface SettlementPlanProps {
  settlements: Settlement[];
  isLoading: boolean;
  groupId?: string;
}

const SettlementPlan: React.FC<SettlementPlanProps> = ({ settlements, isLoading, groupId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const copySettlementPlan = () => {
    const text = settlements.map(s => {
      return `${s.from.name} pays ${s.to.name}: ${s.currency} ${s.amount.toFixed(2)}`;
    }).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => toast('Copied to clipboard!'))
      .catch(() => toast('Failed to copy'));
  };

  // Send reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: (data: { groupId: string; toUserId: string; amount: number; currency: string }) => {
      return axios.post(`${import.meta.env.VITE_API_URL || '/api'}/settlements/remind`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    },
    onSuccess: () => {
      toast('Reminder sent successfully', {
        description: 'The user has been notified about the payment.'
      });
      // Invalidate reminders query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: () => {
      toast('Failed to send reminder', {
        description: 'Please try again later.',
      });
    }
  });

  const sendReminder = (settlement: Settlement) => {
    // Only allow the receiver (creditor) to send reminders
    if (user?.id === settlement.to.id && groupId) {
      sendReminderMutation.mutate({
        groupId,
        toUserId: settlement.from.id,
        amount: settlement.amount,
        currency: settlement.currency
      });
    }
  };

  // Help function to display amounts in preferred currency
  const displayAmount = async (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) {
      return `${toCurrency} ${amount.toFixed(2)}`;
    }
    
    try {
      const convertedAmount = await currencyApi.convertCurrency(amount, fromCurrency, toCurrency);
      return `${toCurrency} ${convertedAmount.toFixed(2)} (${fromCurrency} ${amount.toFixed(2)})`;
    } catch (error) {
      return `${fromCurrency} ${amount.toFixed(2)}`;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Simplified Settlement Plan</CardTitle>
            <CardDescription>
              The most efficient way to settle all debts
            </CardDescription>
          </div>
          {settlements.length > 0 && (
            <Button variant="outline" size="sm" onClick={copySettlementPlan}>
              <Clipboard className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Calculating settlements...</span>
          </div>
        ) : settlements.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Good news! All balances are settled in this group.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {settlements.map((settlement, index) => {
              const userIsPayer = settlement.from.id === user?.id;
              const userIsReceiver = settlement.to.id === user?.id;
              const isUserInvolved = userIsPayer || userIsReceiver;
              
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isUserInvolved ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={settlement.from.avatar} alt={settlement.from.name} />
                      <AvatarFallback>{getInitials(settlement.from.name)}</AvatarFallback>
                    </Avatar>
                    <span className="mx-2 font-medium">
                      {userIsPayer ? 'You' : settlement.from.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={settlement.to.avatar} alt={settlement.to.name} />
                      <AvatarFallback>{getInitials(settlement.to.name)}</AvatarFallback>
                    </Avatar>
                    <span className="mx-2 font-medium">
                      {userIsReceiver ? 'You' : settlement.to.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-right">
                      {settlement.currency} {settlement.amount.toFixed(2)}
                    </div>
                    {userIsReceiver && !userIsPayer && groupId && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendReminder(settlement)} 
                        disabled={sendReminderMutation.isPending}
                      >
                        {sendReminderMutation.isPending ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : 'Send Reminder'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettlementPlan;
