
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CallToAction from '@/components/landing/CallToAction';

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </MainLayout>
  );
};

export default Index;
