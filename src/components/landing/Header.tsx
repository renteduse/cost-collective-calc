
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedLogo from './AnimatedLogo';

const Header: React.FC = () => {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 w-full border-b">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <AnimatedLogo />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link to="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
            How It Works
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
            About
          </Link>
          <Link to="/faqs" className="transition-colors hover:text-foreground/80 text-foreground/60">
            FAQs
          </Link>
          <Link to="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-end space-x-2 flex-1">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
