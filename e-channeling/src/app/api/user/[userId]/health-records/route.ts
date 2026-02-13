import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/utils/rateLimit";
import { getHealthRecordsById } from "@/services/user/healthRecord.service";

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

        const healthRecords = await getHealthRecordsById(userId);

        if (!healthRecords) {
            return NextResponse.json(
                { success: false, message: "Health records not found" },
                { status: 404 }
            );
        }

        const recordsWithPrescriptions = healthRecords.filter(
            record => record.prescriptions.length > 0
        );

        if (recordsWithPrescriptions.length === 0) {
            return NextResponse.json(
                { success: false, message: "No prescriptions found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Health records fetched successfully",
                data: recordsWithPrescriptions
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