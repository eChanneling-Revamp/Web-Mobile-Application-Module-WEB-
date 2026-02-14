import { rateLimit } from "@/lib/utils/rateLimit";
import { updateBooking } from "@/services/booking/booking.service";
import {
    UpdateBookingInput,
    updateBookingSchema,
} from "@/validations/booking/updateBooking.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// update appointment by id
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ appointmentNumber: string }> }
) {
    try {
        const { appointmentNumber } = await params;
        const body = await request.json();

        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getSingleBooking:${ip}`, 5);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many booking attempts. Please try again later." },
                { status: 429 }
            );
        }

        let validatedData: UpdateBookingInput;

        try {
            validatedData = updateBookingSchema.parse(body);
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

        const updateAppointment = await updateBooking(
            appointmentNumber,
            validatedData
        );

        return NextResponse.json({
            success: true,
            message: "Booking updated successfully",
            data: updateAppointment,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// cancel appointment by appointment number
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ appointmentNumber: string }> }
) {
    try {
        const { appointmentNumber } = await params;

        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`cancelBooking:${ip}`, 5);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many cancellation attempts. Please try again later." },
                { status: 429 }
            );
        }

        if (!appointmentNumber) {
            return NextResponse.json(
                { success: false, message: "Appointment number is required" },
                { status: 400 }
            );
        }

        // First get the appointment to find its ID
        const appointment = await updateBooking(appointmentNumber, {});

        if (!appointment) {
            return NextResponse.json(
                { success: false, message: "Appointment not found" },
                { status: 404 }
            );
        }

        // Import and call cancel function
        const { cancelAppointment } = await import("@/services/booking/booking.service");
        const cancelledAppointment = await cancelAppointment(appointment.id);

        return NextResponse.json({
            success: true,
            message: "Appointment cancelled successfully",
            data: {
                status: cancelledAppointment.status,
                cancellationDate: cancelledAppointment.cancellationDate,
            },
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal server error"
            },
            { status: 500 }
        );
    }
}
