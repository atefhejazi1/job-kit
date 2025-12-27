"use client";

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 text-primary hover:text-[#E04E00] dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Registration
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
            <p className="text-gray-600 dark:text-gray-300">Last updated: November 9, 2025</p>
          </div>

          {/* Content */}
          <div className="prose max-w-none text-gray-700 dark:text-gray-300 transition-colors">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
            <p className="mb-6">
              By accessing and using JobKit, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of JobKit per device for 
              personal, non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on JobKit</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Account</h2>
            <p className="mb-6">
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password 
              and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Privacy Policy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the Service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Prohibited Uses</h2>
            <p className="mb-4">You may not use our service:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Content</h2>
            <p className="mb-6">
              Our Service allows you to post, link, store, share and otherwise make available certain 
              information, text, graphics, or other material. You are responsible for the content that 
              you post to the Service, including its legality, reliability, and appropriateness.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your account immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall JobKit, nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new 
              terms taking effect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Information</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: support@jobkit.com
              <br />
              Address: JobKit Inc., 123 Business St, Suite 100, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
