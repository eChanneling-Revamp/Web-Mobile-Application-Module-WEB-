import { rateLimit } from "@/lib/utils/rateLimit";
import { updatePaymentStatus } from "@/services/booking/booking.service";
import {
    PaymentInput,
    paymentSchema,
} from "@/validations/payment/payment.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
    try {
        console.log("Payment Endpoint ")
        const body = await request.json();

        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`payments:${ip}`, 3);
        if (!isAllowed) {
            return NextResponse.json(
                {
                    error: "Too many payments attempts. Please try again later.",
                },
                { status: 429 }
            );
        }

        let validatedData: PaymentInput;

        try {
            validatedData = paymentSchema.parse(body);
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

        // send API request to the Payment Gateway
        const payments = true;

        if (!payments) {
            return NextResponse.json(
                {
                    success: true,
                    data: payments,
                    message: "Payment Not Successful",
                },
                { status: 400 }
            );
        }

        // update payment status in the booking
        const updateAppointment = await updatePaymentStatus(
            validatedData.appointmentNumber
        );

        return NextResponse.json(
            {
                success: true,
                data: { payments, updateAppointment },
                message: "Appointment Confirmed and Payment Successful",
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 400 }
        );
    }
}
