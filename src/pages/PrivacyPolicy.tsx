
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6 lg:max-w-4xl">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-muted/50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center gradient-text">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                At CareerVision, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="leading-relaxed mt-3">
                This privacy policy applies to personal data we collect from you when you use our services, visit our website, or interact with us in any other way.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
              <p className="leading-relaxed">
                We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback, and survey responses.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                <li><strong>Career Data</strong> includes your skills, experience, education, certifications, career goals, and professional interests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
              <p className="leading-relaxed">
                We use your data to provide and improve our services. This includes:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Providing personalized career insights and recommendations</li>
                <li>Analyzing job market trends and skill demands</li>
                <li>Creating and managing your account</li>
                <li>Improving our website and services</li>
                <li>Communicating with you about our services</li>
                <li>Ensuring the security of our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Third Parties</h2>
              <p className="leading-relaxed">
                We may share your personal data with the following categories of third parties:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Service providers who provide IT and system administration services</li>
                <li>Professional advisers including lawyers, bankers, auditors, and insurers</li>
                <li>Regulators and other authorities who require reporting of processing activities in certain circumstances</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="leading-relaxed">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
              <p className="leading-relaxed mt-3">
                We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. GDPR and Your Rights</h2>
              <p className="leading-relaxed">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="leading-relaxed">
                Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. We use cookies to collect information in order to improve our services for you.
              </p>
              <p className="leading-relaxed mt-3">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <p className="leading-relaxed mt-3">
                We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@careervision.io.
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

export default PrivacyPolicy;
