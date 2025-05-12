
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Users } from 'lucide-react';
import { groupApi } from '@/services/apiService';

const formSchema = z.object({
  inviteCode: z.string().length(8, 'Invite code must be 8 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const JoinGroupForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const group = await groupApi.joinGroup(data.inviteCode);
      toast('Group joined', {
        description: `You've successfully joined ${group.name}.`,
      });
      navigate(`/groups/${group._id}`);
    } catch (error: any) {
      toast('Error joining group', {
        description: error.response?.data?.message || 'Invalid invite code. Please check and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <div className="mx-auto mb-4 bg-primary/20 p-3 rounded-full">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-center">Join a Group</CardTitle>
        <CardDescription className="text-center">
          Enter an invite code to join an existing expense group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCD1234"
                      {...field}
                      value={field.value.toUpperCase()}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="text-center text-lg tracking-widest font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    The invite code should be 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Group'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JoinGroupForm;
