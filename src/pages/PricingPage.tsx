
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  buttonText,
}) => {
  return (
    <div className={`bg-card border rounded-xl p-6 md:p-8 flex flex-col ${highlighted ? 'border-primary ring-2 ring-primary/20 shadow-lg relative' : 'shadow-sm'}`}>
      {highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground ml-1">/month</span>}
      </div>
      
      <div className="mb-6 flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        className="w-full"
        variant={highlighted ? "default" : "outline"}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h1>
              <p className="text-xl text-muted-foreground">
                Choose the plan that's right for you and start splitting expenses with your friends.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingTier
                name="Free"
                price="Free"
                description="Perfect for occasional splitting with friends"
                features={[
                  "Up to 3 active groups",
                  "Basic expense tracking",
                  "Equal splits only",
                  "7 days expense history",
                  "Email support"
                ]}
                buttonText="Get Started"
              />
              
              <PricingTier
                name="Pro"
                price="$4.99"
                description="For frequent travelers and roommates"
                features={[
                  "Unlimited groups",
                  "Advanced expense tracking",
                  "Custom splits",
                  "Full expense history",
                  "Priority support",
                  "Export to CSV"
                ]}
                highlighted={true}
                buttonText="Start 14-Day Trial"
              />
              
              <PricingTier
                name="Team"
                price="$9.99"
                description="For teams and organizations"
                features={[
                  "Everything in Pro",
                  "Team admin controls",
                  "Group categories",
                  "API access",
                  "Custom branding",
                  "Dedicated support"
                ]}
                buttonText="Contact Sales"
              />
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-xl font-semibold mb-4">Have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Contact our friendly team for help choosing the right plan for your needs.
              </p>
              <Button variant="outline">Contact Support</Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
