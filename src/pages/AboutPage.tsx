
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Users, Award, Clock } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">
              <div className="md:w-1/2 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About BudgetSplit</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  We're on a mission to make group expenses simple and stress-free.
                </p>
                
                <div className="space-y-6">
                  <p>
                    We created BudgetSplit because we understand the challenges of managing shared expenses. 
                    Whether you're traveling with friends, sharing an apartment, or organizing a group event, 
                    keeping track of who owes what can be complicated and sometimes even strain relationships.
                  </p>
                  
                  <p>
                    Our platform streamlines the process of tracking, splitting, and settling shared expenses, 
                    allowing you to focus on making memories instead of calculating costs.
                  </p>
                </div>
                
                <div className="mt-8">
                  <Link to="/register">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-8 md:p-12 animate-scale">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm">
                        <Users className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">50K+</h3>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm">
                        <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">$2M+</h3>
                        <p className="text-sm text-muted-foreground">Expenses Settled</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm">
                        <Award className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">4.8/5</h3>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm">
                        <Clock className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">5+ Years</h3>
                        <p className="text-sm text-muted-foreground">In Business</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                BudgetSplit began with a simple observation: managing group expenses was needlessly complicated.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">The Problem</h3>
                <p>
                  After a vacation with friends where we spent hours with spreadsheets trying to figure out 
                  who owed what to whom, we knew there had to be a better way. We found that existing 
                  solutions were either too complex or too simplistic for real-world scenarios.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">The Solution</h3>
                <p>
                  We set out to create an intuitive platform that would handle the mathematics of expense 
                  splitting while being flexible enough to accommodate real-world scenarios like unequal splits, 
                  multiple currencies, and simplified settlements.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Today</h3>
                <p>
                  BudgetSplit has grown into a trusted platform used by thousands of groups around the world. 
                  We're constantly improving based on user feedback and remain committed to our core mission: 
                  making shared finances simple so you can focus on what matters.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
              <p className="text-lg text-muted-foreground mb-12">
                Meet the passionate individuals behind BudgetSplit
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 mb-4"></div>
                  <h3 className="text-xl font-semibold">Alex Chen</h3>
                  <p className="text-muted-foreground">Founder & CEO</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 mb-4"></div>
                  <h3 className="text-xl font-semibold">Mia Johnson</h3>
                  <p className="text-muted-foreground">Lead Developer</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 mb-4"></div>
                  <h3 className="text-xl font-semibold">David Park</h3>
                  <p className="text-muted-foreground">Head of Design</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
