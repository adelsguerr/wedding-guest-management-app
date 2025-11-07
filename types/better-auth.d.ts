// Tipos para Better Auth Server
declare module "better-auth" {
  export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
  }

  export interface Session {
    id: string;
    userId: string;
    expiresAt: Date;
    user: User;
  }

  export interface BetterAuthOptions {
    database: any;
    emailAndPassword?: {
      enabled: boolean;
      requireEmailVerification?: boolean;
    };
    session?: {
      expiresIn?: number;
      updateAge?: number;
    };
    user?: {
      additionalFields?: Record<string, any>;
    };
    trustedOrigins?: string[];
  }

  export function betterAuth(options: BetterAuthOptions): any;
}

// Tipos para Better Auth React Client
declare module "better-auth/react" {
  export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
  }

  export interface Session {
    user: User;
  }

  export interface AuthClientOptions {
    baseURL: string;
  }

  export interface UseSessionReturn {
    data: { user: User } | null;
    isPending: boolean;
    error: Error | null;
  }

  export interface SignInEmailMethod {
    (credentials: { email: string; password: string }): Promise<any>;
  }

  export interface SignUpEmailMethod {
    (credentials: { email: string; password: string; name: string }): Promise<any>;
  }

  export interface AuthClient {
    signIn: {
      email: SignInEmailMethod;
    };
    signOut: () => Promise<void>;
    signUp: {
      email: SignUpEmailMethod;
    };
    useSession: () => UseSessionReturn;
  }

  export function createAuthClient(options: AuthClientOptions): AuthClient;

  export function useSession(): UseSessionReturn;
}

// Tipos para Better Auth Adapters
declare module "better-auth/adapters/prisma" {
  import { PrismaClient } from "@prisma/client";
  
  export function prismaAdapter(
    prisma: PrismaClient,
    options: { provider: string }
  ): any;
}
