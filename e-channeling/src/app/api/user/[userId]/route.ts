import { rateLimit } from "@/lib/utils/rateLimit";
import {
    deleteUserById,
    getUserById,
    updateUserById,
} from "@/services/user/user.service";
import {
    UpdateUserInput,
    updateUserSchema,
} from "@/validations/user/updateUser.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// get user
export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getUser:${ip}`, 20);
        if (!isAllowed) {
            return NextResponse.json(
                {
                    error: "Too many attempts. Please try again later.",
                },
                { status: 429 }
            );
        }

        const { userId } = await params;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "UserId required!" },
                { status: 400 }
            );
        }

        const user = await getUserById(userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User details fetched successfully",
            data: user,
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
}

// update user by id ( Can upadate partial user data )
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`updateUser:${ip}`, 3);
        if (!isAllowed) {
            return NextResponse.json(
                {
                    error: "Too many attempts. Please try again later.",
                },
                { status: 429 }
            );
        }

        const { userId } = await params;
        const body = await request.json();

        const existUser = await getUserById(userId);

        if (!existUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        let validatedData: UpdateUserInput;
        try {
            validatedData = updateUserSchema.parse(body);
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                return NextResponse.json(
                    { error: firstError.message },
                    { status: 400 }
                );
            }
            throw error;
        }

        const user = await updateUserById(userId, validatedData);

        return NextResponse.json(
            { success: true, message: "User updated successfully", data: user },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// delete user by id
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`deleteUser:${ip}`, 3);
        if (!isAllowed) {
            return NextResponse.json(
                {
                    error: "Too many attempts. Please try again later.",
                },
                { status: 429 }
            );
        }

        const { userId } = await params;

        const existUser = await getUserById(userId);

        if (!existUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const user = await deleteUserById(userId);

        return NextResponse.json(
            { success: true, message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
