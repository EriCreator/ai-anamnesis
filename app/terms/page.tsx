import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Header section with logo/branding */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: April 26, 2025
        </p>
      </div>

      {/* Document container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-3xl w-full p-8 mb-8">
        <div className="prose dark:prose-invert mx-auto">
          {/* Introduction */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            Please read these terms carefully before using our services.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this AI Anamnesis service, you acknowledge
            that you have read, understood, and agree to be bound by these Terms
            of Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            This service provides an AI-powered Anamnesis for health-related
            inquiries and patient information collection. The AI provides
            information but does not replace professional medical advice.
          </p>

          {/* Add more sections as needed */}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="text-center">
        <Link href="/" className="text-primary hover:underline mr-6">
          Home
        </Link>
        <Link href="/privacy" className="text-primary hover:underline mr-6">
          Privacy Policy
        </Link>
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
