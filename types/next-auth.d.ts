import "next-auth";
import "next-auth/jwt";
import "next/server";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        birthday: string;
        gender: string;
        school: string;
        role: string;
        id_no: string;
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        birthday: string;
        gender: string;
        school: string;
        role: string;
        id_no: string;
    }
}

declare module "next/server" {
  interface NextRequest {
    auth?: {
      user?: {
        role?: string;
      }

    };
  }
}