import { rateLimit } from "@/lib/utils/rateLimit";
import { registerUser } from "@/services/auth/signup.service";
import {
    SignupInput,
    signupSchema,
} from "@/validations/signup/createUser.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        //Get client IP for rate limiting
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";
        console.log("Client IP ", ip);

        const isAllowed = await rateLimit(`signup:${ip}`);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many signup attempts. Please try again later." },
                { status: 429 },
            );
        }

        const body = await req.json();
        console.log("Body data ", body);

        let validatedData: SignupInput;
        try {
            validatedData = signupSchema.parse(body);
        } catch (error) {
            if (error instanceof ZodError) {
                // Return the first validation error message
                const firstError = error.issues[0];
                return NextResponse.json(
                    { error: firstError.message },
                    { status: 400 },
                );
            }
            throw error;
        }

        const result = await registerUser(validatedData);

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error(
            "Signup error:",
            error instanceof Error ? error.message : "Unknown error",
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Signup failed, please try again later.",
            },
            { status: 500 },
        );
    }
}
