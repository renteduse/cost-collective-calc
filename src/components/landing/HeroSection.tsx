
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Split expenses with friends,
              <span className="text-primary block mt-2">without the hassle</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              BudgetSplit makes it easy to track shared expenses and settle debts with friends, roommates, and travel companions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-accent/40 rounded-full blur-3xl" />
            
            <div className="relative bg-card border rounded-2xl shadow-xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="font-semibold text-xl">Trip to Paris</h3>
                  <div className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full">
                    4 members
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Sample expense items */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        🍽️
                      </div>
                      <div>
                        <p className="font-medium">Dinner at Eiffel Tower</p>
                        <p className="text-sm text-muted-foreground">Paid by Sophia</p>
                      </div>
                    </div>
                    <p className="font-semibold">€120.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        🚕
                      </div>
                      <div>
                        <p className="font-medium">Taxi to hotel</p>
                        <p className="text-sm text-muted-foreground">Paid by Alex</p>
                      </div>
                    </div>
                    <p className="font-semibold">€45.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        🎟️
                      </div>
                      <div>
                        <p className="font-medium">Museum tickets</p>
                        <p className="text-sm text-muted-foreground">Paid by James</p>
                      </div>
                    </div>
                    <p className="font-semibold">€75.50</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Sophia owes Alex:</p>
                    <p className="text-negative font-bold">€38.75</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
