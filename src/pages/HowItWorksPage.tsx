
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Receipt, ChevronRight, CreditCard, FileText } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Create or Join a Group",
      description: "Start by creating a group for your trip, apartment, or event. Invite your friends by sharing the unique group code.",
      detail: "Groups help organize your shared expenses in one place. You can create multiple groups for different purposes like roommates, trips, events, or projects."
    },
    {
      icon: <Receipt className="h-12 w-12 text-primary" />,
      title: "Add Expenses as They Happen",
      description: "Record expenses as you go. Specify who paid, the amount, and how to split it (equally or with custom amounts).",
      detail: "You can add expenses in any currency, and BudgetSplit will handle the currency conversion. Add details like receipts, dates, and notes to keep everything organized."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "View Balances and Settle Up",
      description: "BudgetSplit automatically calculates who owes what to whom and generates a simplified settlement plan.",
      detail: "The settlement plan shows the minimum number of transactions needed to settle all debts. You can then make these payments using your preferred payment method."
    },
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Export and Review",
      description: "Export your expense data as a CSV file for your records or for further analysis.",
      detail: "Keep track of your spending patterns, split history, and balances over time. All your data is securely stored and accessible whenever you need it."
    }
  ];

  const features = [
    "Multi-currency support with automatic conversion",
    "Support for equal and custom amount splits",
    "Simplified settlement recommendations",
    "Group expense history and export",
    "Reminders for settling up",
    "Real-time balance updates"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="py-12">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">How BudgetSplit Works</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                BudgetSplit makes it easy to track and split expenses with friends, roommates, or any group. Here's how it works in a few simple steps.
              </p>
            </div>
            
            <div className="space-y-12 mt-16">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 items-center">
                  <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="flex items-center mb-4">
                      {step.icon}
                      <div className="ml-4 text-2xl font-bold">{`Step ${index + 1}`}</div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <p>{step.detail}</p>
                  </div>
                  
                  <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
                      <div className="w-full max-w-xs aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-24 bg-muted/30 rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Key Features</h2>
                <p className="text-muted-foreground">
                  BudgetSplit comes packed with features to make expense management easy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Sign up in minutes and start splitting expenses with your friends without the hassle of complicated calculations.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/register">
                  <Button size="lg" className="min-w-[150px]">Sign Up Free</Button>
                </Link>
                <Link to="/faqs">
                  <Button size="lg" variant="outline" className="min-w-[150px]">
                    View FAQs
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
