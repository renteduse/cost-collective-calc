
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const FAQsPage: React.FC = () => {
  const faqs = [
    {
      question: "How does BudgetSplit work?",
      answer: "BudgetSplit allows you to create groups for shared expenses, add expenses to those groups, and automatically calculates who owes what. When you add an expense, you specify who paid, the amount, and how it should be split. BudgetSplit then generates a simplified settlement plan with the minimum number of transactions needed to settle all debts."
    },
    {
      question: "Is BudgetSplit free to use?",
      answer: "Yes, BudgetSplit offers a free tier that includes all essential features for managing group expenses. We also offer premium plans with advanced features for power users and businesses."
    },
    {
      question: "How do I invite friends to my group?",
      answer: "When you create a group, you'll receive a unique invite code. Share this code with your friends, and they can use it to join your group after creating their own BudgetSplit account."
    },
    {
      question: "Can I split expenses unequally?",
      answer: "Absolutely! BudgetSplit supports both equal splitting and custom amount splitting. When adding an expense, you can choose 'Custom amounts' and specify exactly how much each participant should pay."
    },
    {
      question: "How does BudgetSplit handle different currencies?",
      answer: "BudgetSplit supports multiple currencies. You can select the currency for each expense, and the system will automatically convert all amounts to the group's default currency for balance calculations using up-to-date exchange rates."
    },
    {
      question: "Can I export my expense data?",
      answer: "Yes, you can export your group's expense data as a CSV file, which can be opened in Excel, Google Sheets, or any spreadsheet application."
    },
    {
      question: "How do I settle up with my friends?",
      answer: "BudgetSplit generates a simplified settlement plan showing the minimum number of transactions needed to settle all debts. You can then make these payments using your preferred payment method outside the app."
    },
    {
      question: "Is my financial information secure?",
      answer: "Yes, BudgetSplit takes security seriously. We use industry-standard encryption to protect your data and never store actual payment details. We only track the amounts owed between users, not the actual financial transactions."
    },
    {
      question: "Can I delete an expense if I made a mistake?",
      answer: "Yes, group administrators and the person who created the expense can edit or delete expenses if mistakes were made."
    },
    {
      question: "What if someone doesn't pay me back?",
      answer: "BudgetSplit provides reminders that can be sent to users who owe money. However, the actual collection of funds happens outside our platform. We recommend discussing payment methods with your group before adding expenses."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="py-12">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about BudgetSplit
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center p-8 rounded-lg border bg-muted/20">
              <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? We're here to help!
              </p>
              <Link to="/contact">
                <Button size="lg">Contact Support</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQsPage;
