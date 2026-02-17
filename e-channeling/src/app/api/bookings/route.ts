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
            console.log("validation error , ", error)
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
            id: appointment.id,
            appointmentNumber: appointment.appointmentNumber,
            bookedById: appointment.bookedById,
            sessionId: appointment.sessionId,
            isNewPatient: appointment.isNewPatient,
            patientName: appointment.patientName,
            patientEmail: appointment.patientEmail,
            patientPhone: appointment.patientPhone,
            patientNIC: appointment.patientNIC,
            patientGender: appointment.patientGender,
            patientAge: appointment.patientAge,
            medicalReportUrl: appointment.medicalReportUrl,
            status: appointment.status,
            consultationFee: appointment.consultationFee,
            totalAmount: appointment.totalAmount,
            paymentStatus: appointment.paymentStatus,
            queuePosition: appointment.queuePosition,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            session: {
                scheduledAt: appointment.session.scheduledAt,
                startTime: appointment.session.startTime,
                doctors: {
                    name: appointment.session.doctors.name,
                },
                hospitals: {
                    name: appointment.session.hospitals.name,
                },
            },
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
