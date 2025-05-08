import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Header section with logo/branding */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: April 26, 2025
        </p>
      </div>

      {/* Document container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-3xl w-full p-8 mb-8">
        <div className="prose dark:prose-invert mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-4 mb-8">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              Disclaimer
            </p>
            <p className="text-sm">
              This is only a draft for our university project for the course AI:
              Law and Technology, it's not a real Privacy Policy and it's not
              part of the content of the paper.
            </p>
          </div>

          {/* Introduction */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            This Privacy Policy describes how we collect, use, and handle your
            personal information when you use our services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information you provide to us, including your
            name, email address, date of birth, and AHV number for identity
            verification and service provision purposes.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to provide health-related services, process
            anamnesis reports, and facilitate communication between you and
            healthcare providers.
          </p>

          <h2>3. Data Storage and Security</h2>
          <p>
            All personal data is stored securely with appropriate technical and
            organizational measures to protect against unauthorized access or
            disclosure.
          </p>

          {/* Add more sections as needed */}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="text-center">
        <Link href="/" className="text-primary hover:underline mr-6">
          Home
        </Link>
        <Link href="/terms" className="text-primary hover:underline mr-6">
          Terms of Service
        </Link>
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
