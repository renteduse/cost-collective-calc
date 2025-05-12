
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BalanceItem {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  paid: number;
  owes: number;
  netBalance: number;
  originalCurrency?: string;
}

interface BalanceSummaryProps {
  balances: BalanceItem[];
  isLoading: boolean;
  currency: string;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ balances, isLoading, currency }) => {
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = balances.map(balance => ({
    name: balance.user.name,
    balance: balance.netBalance,
    color: balance.netBalance >= 0 ? '#22c55e' : '#ef4444'
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Group Balance Summary</CardTitle>
          <CardDescription>
            Overview of who's owed money and who owes others in the group
            {currency && <span className="font-medium ml-1">(All values shown in {currency})</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(value) => `${currency} ${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${currency} ${value}`, 'Balance']}
                  labelFormatter={(name) => `${name}`}
                />
                <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {balances.map(balance => {
          const isCurrentUser = balance.user.id === user?.id;
          const balancePositive = balance.netBalance > 0;

          return (
            <Card key={balance.user.id} className={`border-l-4 ${balancePositive ? 'border-l-positive' : 'border-l-negative'}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={balance.user.avatar} alt={balance.user.name} />
                    <AvatarFallback>{getInitials(balance.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{isCurrentUser ? 'You' : balance.user.name}</h4>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total paid</span>
                        <span className="font-medium">{currency} {balance.paid.toFixed(2)}</span>
                      </div>
                      <Progress value={(balance.paid / (Math.max(balance.paid, balance.owes) || 1)) * 100} className="h-1 bg-muted" />
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total owed</span>
                        <span className="font-medium">{currency} {balance.owes.toFixed(2)}</span>
                      </div>
                      <Progress value={(balance.owes / (Math.max(balance.paid, balance.owes) || 1)) * 100} className="h-1 bg-muted" />
                    </div>
                  </div>
                </div>
                <div className={`mt-3 text-right font-semibold ${balancePositive ? 'text-positive' : 'text-negative'}`}>
                  {balancePositive
                    ? `Is owed ${currency} ${Math.abs(balance.netBalance).toFixed(2)}`
                    : `Owes others ${currency} ${Math.abs(balance.netBalance).toFixed(2)}`
                  }
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BalanceSummary;
