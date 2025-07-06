
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/auth">
            <Button variant="ghost" className="mb-4 hover:bg-slate-100 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign Up
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
            <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 shadow-xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 mb-6">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Personal information (name, email address)</li>
              <li>Career information (current role, experience, skills)</li>
              <li>Usage data and preferences</li>
              <li>Communication data when you contact us</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Provide personalized career guidance and insights</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Information Sharing</h2>
            <p className="text-slate-600 mb-6">
              We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>In connection with a business transaction</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. AI and Data Processing</h2>
            <p className="text-slate-600 mb-6">
              CareerVision uses AI technology to provide personalized career guidance. Your career data may be processed by AI systems to generate insights and recommendations. We implement appropriate safeguards to protect your data during this processing.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Data Security</h2>
            <p className="text-slate-600 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Data Retention</h2>
            <p className="text-slate-600 mb-6">
              We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Your Rights</h2>
            <p className="text-slate-600 mb-6">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain communications</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Cookies</h2>
            <p className="text-slate-600 mb-6">
              We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">9. Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@careervision.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
