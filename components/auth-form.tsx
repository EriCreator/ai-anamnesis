import Form from 'next/form';

import { AHVInput } from './ui/ahv-input';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
  isRegistration = false,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
  isRegistration?: boolean;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@domain.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {/* Additional fields for registration */}
      {isRegistration && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="firstName"
                className="text-zinc-600 font-normal dark:text-zinc-400"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                className="bg-muted text-md md:text-sm"
                type="text"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="lastName"
                className="text-zinc-600 font-normal dark:text-zinc-400"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                className="bg-muted text-md md:text-sm"
                type="text"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="dateOfBirth"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Date of Birth
            </Label>

            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              className="bg-muted text-md md:text-sm"
              type="date"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="ahvNumber"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              AHV Number
            </Label>
            <AHVInput id="ahvNumber" name="ahvNumber" />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="mt-1 size-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the{' '}
                <a
                  href="/terms"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
        </>
      )}

      {children}
    </Form>
  );
}
