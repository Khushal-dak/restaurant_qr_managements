
import React from 'react';
import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <TriangleAlert className="w-24 h-24 text-primary mb-4" />
      <h1 className="text-6xl font-extrabold text-neutral-dark mb-2">404</h1>
      <p className="text-2xl font-semibold text-neutral mb-6">Page Not Found</p>
      <p className="max-w-md text-neutral mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/login">
        <Button size="lg">Go to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
