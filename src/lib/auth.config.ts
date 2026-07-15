import type { NextAuthConfig } from "next-auth";

// Configurazione "edge-safe" senza Prisma, utilizzata dal middleware.
// La configurazione completa (con provider e adapter) si trova in `auth.ts`.
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
