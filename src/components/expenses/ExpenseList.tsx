
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Edit, MoreVertical, Trash, Receipt } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';

interface ExpenseParticipant {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  share: number;
}

export interface Expense {
  _id: string;
  group: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paidBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  splitType: 'equal' | 'custom';
  participants: ExpenseParticipant[];
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onDelete: (expenseId: string) => void;
  groupId: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  isLoading,
  onDelete,
  groupId,
}) => {
  const { user } = useAuth();

  const handleDelete = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(expenseId);
    }
  };

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
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-5 w-1/3 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="h-8 w-1/3 bg-muted rounded"></div>
                <div className="h-8 w-1/4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card className="w-full border-dashed border-2 bg-muted/50">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Receipt className="h-12 w-12 text-muted-foreground" />
            <CardTitle>No Expenses Yet</CardTitle>
            <CardDescription className="max-w-xs">
              Add your first expense to start tracking shared costs in this group.
            </CardDescription>
            <Link to={`/groups/${groupId}/expenses/new`}>
              <Button>Add First Expense</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense._id} className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-lg">{expense.description}</CardTitle>
                <CardDescription>
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link to={`/groups/${groupId}/expenses/${expense._id}/edit`}>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(expense._id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={expense.paidBy.avatar} alt={expense.paidBy.name} />
                  <AvatarFallback>{getInitials(expense.paidBy.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    Paid by {expense.paidBy._id === user?.id ? 'you' : expense.paidBy.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge variant={expense.splitType === 'equal' ? 'secondary' : 'outline'}>
                      {expense.splitType === 'equal' ? 'Split equally' : 'Custom split'}
                    </Badge>
                    <p className="text-xs text-muted-foreground ml-2">
                      {expense.participants.length} participants
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {expense.currency} {expense.amount.toFixed(2)}
                </p>
              </div>
            </div>
            {expense.notes && (
              <p className="mt-4 text-sm text-muted-foreground border-t pt-2">{expense.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;
