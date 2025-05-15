import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDoctor = isLoggedIn && auth.user?.email === 'doctor@email.com';
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnTermsOrPrivacy =
        nextUrl.pathname.startsWith('/terms') ||
        nextUrl.pathname.startsWith('/privacy');
      const isAuthApi = nextUrl.pathname.startsWith('/api/auth');

      const isDoctorRoute =
        nextUrl.pathname.startsWith('/doctor') ||
        nextUrl.pathname.startsWith('/doctor_old');

      if (isAuthApi) {
        return true;
      }

      if (isDoctorRoute) {
        if (isDoctor) {
          return true;
        }
        return false;
      }

      if (isDoctor && !isDoctorRoute) {
        return Response.redirect(new URL('/doctor', nextUrl as unknown as URL));
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      if (isOnTermsOrPrivacy) {
        return true; // Always allow access to terms and privacy pages
      }

      if (isOnRegister || isOnLogin) {
        return true; // Always allow access to register and login pages
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
