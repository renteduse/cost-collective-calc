
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const blogPosts = [
  {
    id: '1',
    title: '5 Tips for Managing Group Expenses During Travel',
    excerpt: 'Traveling with friends can be amazing, but managing expenses can get tricky. Here are our top tips for stress-free expense management.',
    imageUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee',
    category: 'Travel',
    date: 'May 5, 2023',
    author: 'Alex Chen'
  },
  {
    id: '2',
    title: 'How to Split Rent and Utilities with Roommates',
    excerpt: 'Living with roommates comes with its challenges, especially when it comes to sharing expenses. Learn the best practices for fair expense sharing.',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    category: 'Roommates',
    date: 'April 18, 2023',
    author: 'Mia Johnson'
  },
  {
    id: '3',
    title: 'The Psychology of Money in Friendships',
    excerpt: 'Money matters can affect friendships in unexpected ways. Understanding these dynamics can help maintain healthy relationships.',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
    category: 'Relationships',
    date: 'March 22, 2023',
    author: 'David Park'
  },
  {
    id: '4',
    title: 'Multi-Currency Expense Management for International Travel',
    excerpt: 'Handling different currencies when traveling internationally with friends? Here's how to make sure everyone pays their fair share.',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
    category: 'Travel',
    date: 'February 15, 2023',
    author: 'Sarah Lee'
  },
  {
    id: '5',
    title: 'Planning a Group Vacation: Budget Management Guide',
    excerpt: 'From transportation to accommodation, food to activities - learn how to plan and manage a budget for your next group vacation.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    category: 'Travel',
    date: 'January 30, 2023',
    author: 'Michael Brown'
  },
  {
    id: '6',
    title: 'How to Handle Unequal Expense Splits in Groups',
    excerpt: 'Sometimes equal splits aren't fair. Learn how to navigate complex expense situations where some members should pay more than others.',
    imageUrl: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6',
    category: 'Finance',
    date: 'January 12, 2023',
    author: 'Emma Wilson'
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="py-12">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">BudgetSplit Blog</h1>
              <p className="text-lg text-muted-foreground">
                Tips, insights and strategies for better group finance management
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-primary font-medium">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">By {post.author}</div>
                    <Link 
                      to={`/blog/${post.id}`} 
                      className="text-sm font-medium hover:underline text-primary"
                    >
                      Read more
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <nav aria-label="Pagination" className="inline-flex space-x-2">
                <span className="px-4 py-2 border rounded text-muted-foreground">Previous</span>
                <a href="#" className="px-4 py-2 border rounded bg-primary text-primary-foreground">1</a>
                <a href="#" className="px-4 py-2 border rounded hover:bg-muted">2</a>
                <a href="#" className="px-4 py-2 border rounded hover:bg-muted">3</a>
                <span className="px-4 py-2 border-none">...</span>
                <a href="#" className="px-4 py-2 border rounded hover:bg-muted">8</a>
                <a href="#" className="px-4 py-2 border rounded hover:bg-muted">Next</a>
              </nav>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
