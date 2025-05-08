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
          Last updated: May 08, 2025
        </p>
      </div>

      {/* Document container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-3xl w-full p-8 mb-8">
        <div className="prose dark:prose-invert mx-auto">
          {/* Disclaimer */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-4 mb-8">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              Disclaimer
            </p>
            <p className="text-sm">
              {`This is only a draft for our university project for the course AI:
              Law and Technology, it's not a real ToS and it's not part of the
              content of the paper.`}
            </p>
          </div>

          {/* Introduction */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            Please read these terms carefully before using our services.
          </p>

          <p>
            {`Our AI-powered anamnesis assistant ("Service") is a web application
            designed to do the first anamnesis and gather information to forward
            to the doctor to assist him in the preliminary consultation process.
            To use this Service you must agree to these Terms of Service, the
            use of the Service is not compulsory and in case you do not accept
            the conditions, we recommend you to contact directly your doctor to
            make an appointment.`}
          </p>

          <h2>1. Purpose of the Service</h2>
          <p>
            This Service is intended to support the doctor in a preliminary
            anamnesis through an AI-powered chatbot.
          </p>

          <h2>2. Use of the Service</h2>
          <p>
            The Service is only permitted to persons over 18 years of age. The
            users must provide correct and accurate information, there will be
            an in-person check to ascertain the information gathered with the
            doctor, but to facilitate this, only true information should be
            written down. By accessing and using this Service, you acknowledge
            that you have read, understood, and agree to be bound by these Terms
            of Service.
          </p>

          <h2>3. No Diagnosis, No Medical Advice</h2>
          <p>
            This service does not give medical advice of any kind, nor does it
            advise on whether and what medication to take. The AI does not
            replace professional medical advice. The purpose of the Service is
            only to collect information provided by the user. Any messages
            written by the chatbot should not be interpreted as medical
            diagnosis or advice.
          </p>

          <h2>4. Privacy and Data Collection</h2>
          <p>
            The Service is marketed in Switzerland and is therefore subject to
            and complies with the Swiss Federal Act on Data Protection (FADP)
            and, where applicable, the General Data Protection Regulation
            (GDPR). By using this Service you agree that your data may be stored
            and processed to create a report to be provided to your doctor
            [SURNAME NAME, MEDICAL STUDIO ADDRESS].
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, we exclude any liability whatsoever
            for use or misuse of the Service.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All contents of the Service (software, documentation) and of the
            project in general are the property of Davide Lovaldi, Eric Vincent
            Leger, Fabian Glanzmann, Levente Imre Dobak.
          </p>

          <h2>7. Modifications and Termination</h2>
          <p>
            This Service may at our discretion undergo term updates at any time.
            This Service may be suspended or terminated at any time.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by Swiss law. Any disputes arising from
            these Terms will be subject to the exclusive jurisdiction of the
            courts of Zürich.
          </p>
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
