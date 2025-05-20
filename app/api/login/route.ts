import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {signIn} from "@/app/auth";

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {error: "Invalid request body", issues: result.error.issues},
                {status: 400}
            );
        }

        const {email, password} = result.data;

        const signInResult = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (signInResult?.error) {
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 401}
            );
        }

        return NextResponse.json(
            {success: true, message: "Authentication successful"},
            {status: 200}
        );
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json(
            {error: "An error occurred during authentication"},
            {status: 500}
        );
    }
}