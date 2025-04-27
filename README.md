# AI Anamnesis Chatbot

An intelligent healthcare chatbot that facilitates automated patient anamnesis collection, streamlines doctor-patient communication, and enhances medical documentation.

## 🌟 Features

- **AI-powered Anamnesis**: Collects patient symptoms and medical history through natural conversation
- **Doctor Dashboard**: Medical professionals can review and manage patient reports
- **Secure Authentication**: User accounts with personal information including AHV (Swiss social security) numbers
- **HIPAA-Compliant**: Ensures patient data security and privacy
- **Dark/Light Mode**: Supports both visual preferences
- **Multi-modal Interface**: Upload images and documents for enhanced interactions

## 📋 System Overview

The AI Anamnesis Chatbot is designed to:

- Collect comprehensive patient information through conversational AI
- Generate structured medical reports from conversations
- Allow doctors to review reports and schedule appointments
- Prioritize patients based on severity/urgency

## 🔧 Tech Stack

- **Frontend**: Next.js, React 19, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **AI**: Google gemini-2.0-flash
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: SWR for data fetching
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- AI provider API keys

### Installation

1. Clone the repository:

```bash
git clone https://github.com/EriCreator/ai-anamnesis.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file with the following variables:

```env
AUTH_SECRET=your_nextauth_secret
POSTGRES_URL=your_postgres_connection_string
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
```

4. Set up the database:

```bash
pnpm run db:migrate
```

5. Start the development server:

```bash
pnpm run dev
```

6. Access the application at http://localhost:3000

## 🏛️ Project Structure

(Project directory structure would go here)

## 👩‍⚕️ User Guide

### For Patients

- Register with your personal information
- Start a new chat with the AI assistant
- Describe your symptoms and medical concerns
- The AI will ask relevant follow-up questions
- A structured report will be generated for doctors

### For Medical Professionals

- Log in to the doctor dashboard
- View patient reports sorted by urgency
- Schedule appointments or contact patients directly
- Review patient symptoms and suggested treatments

## 🔐 Privacy & Security

This application is designed with patient privacy as a priority:

- All medical data is encrypted
- Compliance with healthcare privacy standards
- Secure authentication mechanisms
- Clear privacy policies and terms of service

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

For end-to-end testing:

```bash
pnpm run test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

This project is based on the [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot) template, which is licensed under the MIT License. We thank the Vercel team for providing this excellent starting point for AI-powered applications.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. This project incorporates work covered by the following copyright and permission notice:

```
Copyright (c) 2023 Vercel, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
```

## 📧 Contact

For any questions or feedback, please reach out to the development team.
