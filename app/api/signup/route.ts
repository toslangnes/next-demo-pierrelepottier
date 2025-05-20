import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {hashPassword} from "@/lib/auth";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = signupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {error: "Invalid request body", issues: result.error.issues},
                {status: 400}
            );
        }

        const {name, email, password} = result.data;

        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return NextResponse.json(
                {error: "A user with this email already exists"},
                {status: 409}
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            {status: 201}
        );
    } catch (error) {
        console.error("Signup API error:", error);
        return NextResponse.json(
            {error: "An error occurred during registration"},
            {status: 500}
        );
    }
}