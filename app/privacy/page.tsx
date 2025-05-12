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
          Last updated: May 09, 2025
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
              This tool is intended to be used only by licensed healthcare
              professionals to assist in the first contact with the patience,
              doing an anamnesis and summarising symptoms. This tool do not
              provide any kind of diagnosis and do not suggest or prescribe
              medicaments and treatments. The diagnosis will always has to be
              made by the healthcare professionals.
            </p>
          </div>

          {/* Introduction */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            This software/tool works as a demonstration of the main
            capabilities. The privacy policy covers the important sections for
            mitigating risks. These are detailed in the seminar paper. It does
            not cover all aspects of data privacy or represents the final data
            policy.
          </p>

          <h2>1. Data collection</h2>
          <p>
            The tool diminishes the amount of collected or generated (sensitive)
            data, which is needed for an anamnesis. It covers in particular the
            user input (in chat), uploaded documents, generated anamnesis and
            extracted list of symptoms. In accordance with the use case of the
            software no diagnosis is generated.
            <br />
            <br />
            The user must avoid personal data as text (like name, address,
            telephone number) in the chat, except properly uploaded documents.
          </p>

          <h2>2. Main processing</h2>
          <p>
            The main processing includes the data collection and display of the
            data. The data can be accessed by the data subject, doctors and
            professionals within the organization.
          </p>
          <h3>2.1 Background processing</h3>
          <p>
            {`Next to the main activities outline above, on a regular basis a routine for anonymization, a routine for backups and
            review (search, display) by "processors" like (doctors, professionals) are granted access.`}
          </p>

          <h2>3. Data destruction</h2>
          <p>
            After three months of inactivity all the (sensitive) data is
            automatically destroyed and cannot be restored. This processing
            autonomously works with any human interaction.
          </p>

          <h3>3.1 On request</h3>
          <p>
            The data subject can request the deletion in written. This covers
            all his data and is confirmed. The implementation takes place soon
            thereafter.
          </p>

          <h2>4. Backup</h2>
          <p>
            {`On a regular basis the client data is backed up. The client data resides in there for the same
            time named in section "Data destruction" (three months).`}
          </p>

          <h2>5. Revocation of consent</h2>
          <p>
            The client can every time revoke his consent for processing in
            written. The revocation applies to all his sensitive data. Albeit
            his personal data and processing relating to her/his technical
            account remains active. The deletion of all data needs to be
            explicitly requested.
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
