
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, CheckCircle, Clipboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

export interface Settlement {
  from: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
}

interface SettlementPlanProps {
  settlements: Settlement[];
  isLoading: boolean;
}

const SettlementPlan: React.FC<SettlementPlanProps> = ({ settlements, isLoading }) => {
  const { user } = useAuth();
  
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
      .catch(() => toast('Failed to copy', { variant: 'destructive' }));
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
                  <div className="font-bold text-right">
                    {settlement.currency} {settlement.amount.toFixed(2)}
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
