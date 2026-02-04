import { rateLimit } from "@/lib/utils/rateLimit";
import { createBooking } from "@/services/booking/booking.service";
import {
    bookingSchema,
    CreateBookingInput,
} from "@/validations/booking/createBooking.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("Body", body)

        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`booking:${ip}`, 5);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many booking attempts. Please try again later." },
                { status: 429 }
            );
        }

        let validatedData: CreateBookingInput;

        try {
            validatedData = bookingSchema.parse(body);
        } catch (error) {
            console.log("validation error , ",error)
            if (error instanceof ZodError) {
                // Return the first validation error message
                const firstError = error.issues[0];
                return NextResponse.json(
                    { error: firstError.message },
                    { status: 400 }
                );
            }
            throw error;
        }

        const appointment = await createBooking(validatedData);

        const sanitizedAppointment = {
            appointmentId: appointment.id,
            appointmentNumber: appointment.appointmentNumber,
            sessionId: appointment.sessionId,
            bookedByUserId: appointment.bookedById,
            patientName: appointment.patientName,
            patientEmail: appointment.patientEmail,
            patientPhone: appointment.patientPhone,
            patientNIC: appointment.patientNIC,
            patientAge: appointment.patientAge,
            patientGender: appointment.patientGender,
            status: appointment.status,
            consultationFee: appointment.consultationFee,
            paymentStatus: appointment.paymentStatus,
            queuePosition: appointment.queuePosition,
        };

        return NextResponse.json(
            {
                success: true,
                message: "Booking created successfully",
                data: sanitizedAppointment,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
