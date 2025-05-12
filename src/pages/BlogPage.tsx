
// Since we're removing the blog page, we'll create a minimal redirect to the landing page
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page since we're removing the blog
    navigate('/');
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default BlogPage;
