import { getReceiptHtml } from "@/lib/utils/getReceiptHtml";
import { rateLimit } from "@/lib/utils/rateLimit";
import { sendEmailOtp } from "@/services/notification/sendEmailOtp";
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`confirmations:${ip}`, 5);
        if (!isAllowed) {
            return NextResponse.json(
                {
                    error: "Too many confirmation attempts. Please try again later.",
                },
                { status: 429 },
            );
        }

        const body = await request.json();

        if (!body) {
            return NextResponse.json(
                {
                    error: "Body is required",
                },
                { status: 400 },
            );
        }

        const confirmationData = body
        console.log("Confirmation Data -- ", confirmationData);
        const email = confirmationData.patientEmail

        const receiptHtml = getReceiptHtml(confirmationData)

        await sendEmailOtp(email, "Appointment Confirmed", receiptHtml)

        return NextResponse.json(
            {
                success: true,
                message: "Appointment Confirmed Email sent successfully",
            },
            { status: 200 },
        );


    } catch (error: any) {
        console.log("Send Confirmation Error -- ", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Something went wrong",
            },
            { status: 500 },
        );

    }






}