
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, User, Settings, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-mobile';
import AnimatedLogo from '../landing/AnimatedLogo';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

interface DashboardHeaderProps {
  title?: string;
}

interface Notification {
  _id: string;
  group: {
    _id: string;
    name: string;
  };
  to: {
    _id: string;
    name: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  createdAt: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/settlements/reminders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name?: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link to="/" className="flex items-center px-2">
                  <AnimatedLogo />
                </Link>
                <div className="mt-8 px-7">
                  <nav className="flex flex-col space-y-2">
                    <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/groups" className="text-muted-foreground hover:text-foreground transition-colors">
                      My Groups
                    </Link>
                    <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                      Profile Settings
                    </Link>
                    <button onClick={handleLogout} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                      Sign Out
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex-1 flex items-center justify-center">
              <Link to="/" className="flex items-center">
                <AnimatedLogo />
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <AnimatedLogo />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
              <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Dashboard
              </Link>
              <Link to="/groups" className="transition-colors hover:text-foreground/80 text-foreground/60">
                My Groups
              </Link>
            </nav>
          </>
        )}

        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              ) : (
                <>
                  {notifications.map(notification => (
                    <DropdownMenuItem key={notification._id} className="p-3 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.to.avatar} alt={notification.to.name} />
                          <AvatarFallback>{getInitials(notification.to.name)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.to.name} requests payment
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.currency} {notification.amount.toFixed(2)} for {notification.group.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-xs"
                    onClick={() => {
                      toast("Notifications marked as read");
                      setNotifications([]);
                    }}
                  >
                    Mark all as read
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name || ''} />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {title && (
        <div className="container py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
