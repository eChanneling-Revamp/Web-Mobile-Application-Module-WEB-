import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/utils/rateLimit";
import { getBookingsById } from "@/services/user/appointment.service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getUser:${ip}`, 10);
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

        const appointments = await getBookingsById(userId);

        if (!appointments) {
            return NextResponse.json(
                { success: false, message: "Appointments not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Appointments fetched successfully",
                data: appointments
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            { status: 500 }
        );
    }
}




