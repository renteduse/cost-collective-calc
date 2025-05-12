
import React from 'react';
import { Users, Receipt, BarChart, ArrowDown } from 'lucide-react';

const steps = [
  {
    title: 'Create or Join a Group',
    description: 'Start by creating a new expense group or joining an existing one with an invite code.',
    icon: <Users className="h-12 w-12 text-primary" />,
  },
  {
    title: 'Log Your Expenses',
    description: 'Add expenses with details like amount, payer, participants, and how to split the cost.',
    icon: <Receipt className="h-12 w-12 text-primary" />,
  },
  {
    title: 'See Who Owes What',
    description: 'View balances at a glance and get simplified settlement suggestions.',
    icon: <BarChart className="h-12 w-12 text-primary" />,
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How BudgetSplit Works</h2>
          <p className="text-xl text-muted-foreground">
            Tracking and settling expenses with friends has never been easier.
          </p>
        </div>
        
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-slide-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="bg-accent rounded-full p-8">
                  {step.icon}
                </div>
                
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="my-6 animate-bounce">
                  <ArrowDown className="h-8 w-8 text-primary/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-16 bg-card border rounded-xl p-8 shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-center">Get started in minutes</h3>
          <p className="text-center text-muted-foreground mb-8">
            No complex setup required. Create your account, invite your friends, and start tracking expenses immediately.
          </p>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <p className="text-sm">Sign Up</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <p className="text-sm">Create Group</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <p className="text-sm">Add Expenses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
