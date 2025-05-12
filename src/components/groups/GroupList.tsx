
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, Users } from 'lucide-react';

export interface Group {
  _id: string;
  name: string;
  description: string;
  inviteCode: string;
  defaultCurrency: string;
  members: {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    role: 'admin' | 'member';
  }[];
  createdAt: string;
}

interface GroupListProps {
  groups: Group[];
  isLoading: boolean;
}

const GroupList: React.FC<GroupListProps> = ({ groups, isLoading }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-4 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-muted"></div>
                ))}
              </div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="w-full border-dashed border-2 bg-muted/50">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground" />
            <CardTitle>No Groups Yet</CardTitle>
            <CardDescription className="max-w-xs">
              Create your first expense group or join an existing one with an invite code.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Link to="/groups/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </Link>
              <Link to="/groups/join">
                <Button variant="outline">Join Existing Group</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group._id} className="card-hover animate-scale">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{group.name}</CardTitle>
              <Badge variant="outline">{group.defaultCurrency}</Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {group.description || 'No description'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-4 mb-4">
              {group.members.slice(0, 3).map((member) => (
                <Avatar key={member.user._id} className="border-2 border-background">
                  <AvatarImage src={member.user.avatar} alt={member.user.name} />
                  <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                </Avatar>
              ))}
              {group.members.length > 3 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-medium">
                  +{group.members.length - 3}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <p className="text-sm text-muted-foreground">
              Created {new Date(group.createdAt).toLocaleDateString()}
            </p>
            <Link to={`/groups/${group._id}`}>
              <Button variant="ghost" size="sm">
                View <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GroupList;
