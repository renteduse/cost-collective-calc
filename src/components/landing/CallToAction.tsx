
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="hero-gradient rounded-2xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
          
          <div className="relative z-10 max-w-2xl animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start splitting expenses fairly with BudgetSplit today
            </h2>
            
            <p className="text-xl mb-8 text-white/90">
              Join thousands of users who are saving time and avoiding awkward money conversations. Sign up for free and start managing shared expenses with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started for Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
