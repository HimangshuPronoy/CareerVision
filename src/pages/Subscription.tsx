import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';

const Subscription = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <SubscriptionPlans />
      </div>
    </DashboardLayout>
  );
};

export default Subscription; 