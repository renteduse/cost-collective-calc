
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { expenseApi, currencyApi, groupApi } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface Member {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: 'admin' | 'member';
}

type SplitType = 'equal' | 'custom';

const formSchema = z.object({
  description: z.string().min(2, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  currency: z.string().min(1, 'Please select a currency'),
  paidBy: z.string().min(1, 'Please select who paid'),
  date: z.date(),
  splitType: z.enum(['equal', 'custom']),
  participants: z.array(z.string()).min(1, 'Select at least one participant'),
  notes: z.string().optional(),
  customShares: z.record(z.coerce.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  expenseId?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenseId }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalShare, setTotalShare] = useState(0);

  // Fetch group details
  const { data: group, isLoading: isLoadingGroup } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupApi.getGroup(groupId!),
    enabled: !!groupId,
  });

  // Fetch expense details if editing
  const { data: expense, isLoading: isLoadingExpense } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => expenseApi.getExpense(expenseId!),
    enabled: !!expenseId,
  });

  // Fetch available currencies
  const { data: currencies = [] } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => currencyApi.getCurrencies(),
  });

  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      currency: '',
      paidBy: user?._id || '',
      date: new Date(),
      splitType: 'equal',
      participants: [],
      notes: '',
      customShares: {},
    },
  });

  // Watch for relevant form changes
  const amount = form.watch('amount');
  const splitType = form.watch('splitType');
  const participants = form.watch('participants');
  const customShares = form.watch('customShares') || {};

  // Update form when group data is loaded
  useEffect(() => {
    if (group) {
      setMembers(group.members || []);
      form.setValue('currency', group.defaultCurrency);
    }
  }, [group, form]);

  // Update form when expense data is loaded (for editing)
  useEffect(() => {
    if (expense) {
      form.reset({
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency,
        paidBy: expense.paidBy._id,
        date: new Date(expense.date),
        splitType: expense.splitType,
        participants: expense.participants.map((p: any) => p.user._id),
        notes: expense.notes || '',
        customShares: expense.participants.reduce((acc: Record<string, number>, p: any) => {
          acc[p.user._id] = p.share;
          return acc;
        }, {}),
      });
    }
  }, [expense, form]);

  // Calculate equal shares when participants change
  useEffect(() => {
    if (splitType === 'equal' && participants.length > 0 && amount > 0) {
      const equalShare = parseFloat((amount / participants.length).toFixed(2));
      const shares = participants.reduce((acc: Record<string, number>, userId: string) => {
        acc[userId] = equalShare;
        return acc;
      }, {});
      form.setValue('customShares', shares);
    }
  }, [amount, participants, splitType, form]);

  // Calculate total share for validation
  useEffect(() => {
    if (splitType === 'custom') {
      const total = Object.values(customShares).reduce((sum, share) => sum + (share || 0), 0);
      setTotalShare(parseFloat(total.toFixed(2)));
    } else {
      setTotalShare(amount);
    }
  }, [customShares, splitType, amount]);

  const onSubmit = async (data: FormValues) => {
    // Validate that custom shares match the total amount
    if (data.splitType === 'custom' && Math.abs(totalShare - data.amount) > 0.01) {
      toast('Invalid shares', {
        description: `The sum of shares (${totalShare}) doesn't match the total amount (${data.amount})`,
        variant: 'destructive',
      });
      return;
    }

    // Prepare participants data with shares
    const participants = data.participants.map(userId => ({
      user: userId,
      share: data.customShares?.[userId] || data.amount / data.participants.length,
    }));

    setIsSubmitting(true);
    
    try {
      const expenseData = {
        group: groupId,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        date: data.date,
        paidBy: data.paidBy,
        splitType: data.splitType,
        participants,
        notes: data.notes,
      };

      if (expenseId) {
        // Update existing expense
        await expenseApi.updateExpense(expenseId, expenseData);
        toast('Expense updated', {
          description: 'The expense has been updated successfully.',
        });
      } else {
        // Create new expense
        await expenseApi.addExpense(expenseData);
        toast('Expense added', {
          description: 'The new expense has been added successfully.',
        });
      }

      // Navigate back to group page
      navigate(`/groups/${groupId}`);
    } catch (error: any) {
      toast('Error saving expense', {
        description: error.response?.data?.message || 'An error occurred while saving the expense.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingGroup || (expenseId && isLoadingExpense)) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{expenseId ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
        <CardDescription>
          {expenseId 
            ? 'Update the details of this expense' 
            : 'Add a new expense to track shared costs in this group'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Dinner at restaurant" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a brief description of the expense
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency: any) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid by</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select who paid" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.user._id} value={member.user._id}>
                            {member.user.name} {member.user._id === user?.id ? '(You)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How to split the expense?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal" id="split-equal" />
                        <label htmlFor="split-equal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Split equally
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="split-custom" />
                        <label htmlFor="split-custom" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Custom amounts
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="participants"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Participants</FormLabel>
                    <FormDescription>
                      Select who's involved in this expense
                    </FormDescription>
                  </div>
                  {members.map(member => (
                    <FormField
                      key={member.user._id}
                      control={form.control}
                      name="participants"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={member.user._id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-4"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(member.user._id)}
                                onCheckedChange={(checked) => {
                                  const updatedParticipants = checked
                                    ? [...field.value, member.user._id]
                                    : field.value.filter(
                                        (value) => value !== member.user._id
                                      );
                                  field.onChange(updatedParticipants);
                                }}
                              />
                            </FormControl>
                            <div className="flex flex-1 items-center justify-between">
                              <FormLabel className="text-sm font-normal">
                                {member.user.name} {member.user._id === user?.id ? '(You)' : ''}
                              </FormLabel>
                              
                              {splitType === 'custom' && field.value?.includes(member.user._id) && (
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={form.watch(`customShares.${member.user._id}`) || ''}
                                  onChange={(e) => {
                                    const shares = { ...form.getValues('customShares') };
                                    shares[member.user._id] = parseFloat(e.target.value) || 0;
                                    form.setValue('customShares', shares);
                                  }}
                                  className="w-24 ml-2"
                                  placeholder="0.00"
                                />
                              )}
                              
                              {splitType === 'equal' && field.value?.includes(member.user._id) && participants.length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  {(amount / participants.length).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                  
                  {splitType === 'custom' && amount > 0 && (
                    <div className="mt-4 p-3 border rounded-md bg-muted/50">
                      <div className="flex justify-between items-center">
                        <span>Total shares:</span>
                        <span className={cn(
                          'font-medium',
                          Math.abs(totalShare - amount) > 0.01 && 'text-red-500'
                        )}>
                          {totalShare.toFixed(2)} / {amount.toFixed(2)}
                        </span>
                      </div>
                      {Math.abs(totalShare - amount) > 0.01 && (
                        <p className="text-red-500 text-sm mt-1">
                          The sum of shares must equal the total amount
                        </p>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about this expense"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/groups/${groupId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {expenseId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  expenseId ? 'Update Expense' : 'Add Expense'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
