
import "next-auth/jwt";


declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  }

  interface User {
    id: number;
    role: string;
    name?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}


