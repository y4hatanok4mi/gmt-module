"use server";

import { signIn, signOut } from "@/auth";
import { signUpSchema } from "@/lib/schema";
import { AuthError } from "next-auth";

import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { userGender, userRole, userSchool } from "@prisma/client";
import { generateVerificationToken } from "@/lib/tokens";

export async function handleCredentialsSignin({ id_no, password }: {
    id_no: string,
    password: string
}) {

    try {
        await signIn("credentials", { id_no, password });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        error: 'Invalid credentials!',
                    }
                default:
                    return {
                        error: 'Something went wrong!',
                    }
            }
        }
        throw error;
    }
};

export async function handleSignOut() {
    await signOut({
        redirectTo: "/auth/signin",
        redirect: true,
      });
}


export async function handleSignUp({ email, password, confirmPassword, fname, lname, bday, gender, school, role, id_no }: {
    fname: string,
    lname: string,
    email: string,
    password: string,
    confirmPassword: string,
    bday: Date,
    gender: userGender,
    school: userSchool,
    role: userRole,
    id_no: string
}) {
    try {
        const parsedCredentials = signUpSchema.safeParse({ email, password, confirmPassword, fname, lname, bday, gender, school, role, id_no });
        if (!parsedCredentials.success) {
            console.log("Validation failed:", parsedCredentials.error);
            return { success: false, message: "Invalid data!" };
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email
            },
        });

        if (existingUserByEmail) {
            return { success: false, message: "Email already exists!" };
        }

        const existingUserByIDNo = await prisma.user.findUnique({
            where: {
                id_no
            },
        });

        if (existingUserByIDNo) {
            return { success: false, message: "ID No. already exists!" };
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        await prisma.user.create({
            data: {
                name: `${fname} ${lname}`,
                email,
                password: hashedPassword,
                birthday: bday,
                gender,
                school,
                role,
                id_no
            },
        });

        const  verificationToken = await generateVerificationToken(email);

        return { success: true, message: "Confirmation email sent!" };
    } catch (error) {
        console.error("Error creating account:", error);
        return { success: false, message: "An unexpected error occurred! Please try again." };
    }
}