
import React from 'react';
import { ArrowRight, PieChart, CreditCard, Share2, FileText } from 'lucide-react';

const features = [
  {
    title: 'Track Group Expenses',
    description: 'Create groups for trips, roommates, or events and track all shared expenses in one place.',
    icon: <Share2 className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Split Expenses Easily',
    description: 'Split costs equally or with custom amounts. Perfect for when someone doesn't participate in an expense.',
    icon: <CreditCard className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Visualize Balances',
    description: 'See who owes what at a glance with clear visualizations of group balances.',
    icon: <PieChart className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Export Expense Data',
    description: 'Export your expense history to CSV for record keeping or further analysis.',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Split expenses, not friendships</h2>
          <p className="text-xl text-muted-foreground">
            BudgetSplit makes it easy to handle shared expenses without the awkwardness of asking for money.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-xl p-6 shadow-sm card-hover animate-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#how-it-works" className="inline-flex items-center text-primary font-semibold hover:underline">
            See how it works
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
