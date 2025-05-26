import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';

const Pricing = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that best fits your career goals
          </p>
        </div>
        <SubscriptionPlans />
      </div>
    </MainLayout>
  );
};

export default Pricing; 