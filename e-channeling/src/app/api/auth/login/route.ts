import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const AUTH_SERVICE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`;

        // Forward the request to the external API
        const response = await fetch(AUTH_SERVICE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // get the id only from the user table and await the result
        const userRecord = await prisma.users.findUnique({
            where: {
                authUserId: data.user.id,
            },
            select: {
                id: true,
            },
        });
        const userId = userRecord ? userRecord.id : null;

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || "Login failed" },
                { status: response.status }
            );
        }

        return NextResponse.json(
            {
                message: data.message,
                user: data.user,
                userId: userId,
                accessToken: data.accessToken,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred during login." },
            { status: 500 }
        );
    }
}
