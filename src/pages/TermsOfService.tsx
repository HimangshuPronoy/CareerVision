
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6 lg:max-w-4xl">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-muted/50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center gradient-text">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to CareerVision ("Company", "we", "our", "us")! As you have just clicked our Terms of Service, please pause, grab a cup of coffee and carefully read the following pages. It will take you approximately 20 minutes.
              </p>
              <p className="leading-relaxed mt-3">
                These Terms of Service ("Terms", "Terms of Service") govern your use of our web pages located at careervision.io operated by CareerVision.
              </p>
              <p className="leading-relaxed mt-3">
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: [Privacy Policy Link].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Agreements</h2>
              <p className="leading-relaxed">
                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
              <p className="leading-relaxed">
                CareerVision is a data-driven SaaS platform that provides insights into job market trends and personalized career recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
              <p className="leading-relaxed">
                When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
              </p>
              <p className="leading-relaxed mt-3">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="leading-relaxed">
                The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of CareerVision and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CareerVision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Collection and Use</h2>
              <p className="leading-relaxed">
                CareerVision collects and analyzes data from various sources, including job boards, company websites, and economic reports. This data is used to provide personalized career insights and recommendations to users.
              </p>
              <p className="leading-relaxed mt-3">
                By using our Service, you agree to our data collection and usage policies as outlined in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="leading-relaxed mt-3">
                If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
              <p className="leading-relaxed mt-3">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes</h2>
              <p className="leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us at support@careervision.io.
              </p>
            </section>

            <div className="text-center mt-10 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;
