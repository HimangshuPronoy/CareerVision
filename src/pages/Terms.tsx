
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Terms of Service</h1>
            <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 shadow-xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-6">
              By accessing and using CareerVision, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Use License</h2>
            <p className="text-slate-600 mb-6">
              Permission is granted to temporarily use CareerVision for personal, non-commercial transitory viewing only. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Creating and managing your career profile</li>
              <li>Using AI-powered career guidance features</li>
              <li>Accessing career insights and analytics</li>
              <li>Participating in career development tools</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. User Account</h2>
            <p className="text-slate-600 mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities under your account.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. AI Services</h2>
            <p className="text-slate-600 mb-6">
              CareerVision uses AI technology to provide career guidance and insights. While we strive for accuracy, AI-generated content should be considered as suggestions and not professional career advice. Always use your judgment and consult with career professionals when making important decisions.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Data Privacy</h2>
            <p className="text-slate-600 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Prohibited Uses</h2>
            <p className="text-slate-600 mb-6">
              You may not use CareerVision:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Disclaimer</h2>
            <p className="text-slate-600 mb-6">
              The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, CareerVision excludes all representations, warranties, and conditions relating to our platform and the use of this platform.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Contact Information</h2>
            <p className="text-slate-600">
              If you have any questions about these Terms of Service, please contact us at legal@careervision.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
