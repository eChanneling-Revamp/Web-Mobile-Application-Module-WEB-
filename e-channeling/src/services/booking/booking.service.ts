import prisma from "@/lib/db/prisma";
import { generateAppointmentNumber } from "@/lib/utils/appointmentNumber";
import { CreateBookingInput } from "@/validations/booking/createBooking.schema";
import { v4 as UUIDv4 } from "uuid";

// create appointment
export async function createBooking(data: Readonly<CreateBookingInput>) {
    return await prisma.$transaction(async (tx) => {

        // if userId is provided, verify user exists
        if (data.userId !== null) {

            const user = await tx.users.findUnique({
                where: { id: data.userId },
            });

            if (!user) {
                throw new Error(
                    "User not found. Please ensure you are logged in.",
                );
            }
        }

        // check session is still AVAILABLE
        const session = await tx.sessions.findUnique({
            where: { id: data.sessionId },
            include: {
                doctors: true,
            },
        });

        if (!session || session.status !== "SCHEDULED") {
            throw new Error("Session not available");
        }

        // get all previous appointments for this patient
        const patientAppointments = await tx.appointments.findMany({
            where: {
                patientNIC: data.patientNIC,
            },
            select: { sessionId: true, status: true },
        });

        // check user has active booking for this session alredy
        const hasActiveBooking = patientAppointments.some(
            (activeBooking) =>
                activeBooking.sessionId === data.sessionId &&
                ["CONFIRMED"].includes(activeBooking.status),
        );

        if (hasActiveBooking) {
            throw new Error("You already have a booking for this session");
        }

        const newPatient = patientAppointments.length === 0;

        // get last token number
        const lastTokenNumber = await tx.appointments.aggregate({
            where: {
                sessionId: data.sessionId,
            },
            _max: {
                queuePosition: true,
            },
        });

        const newQueuePosition = (lastTokenNumber._max.queuePosition ?? 0) + 1;

        if (newQueuePosition > session.capacity) {
            throw new Error(
                "Session capacity reached. Cannot book more appointments.",
            );
        }

        const appointmentId = UUIDv4();
        const appointmentNumber = generateAppointmentNumber();
        const consultationFee = session.doctors.consultationFee;

        const appointment = await tx.appointments.create({
            data: {
                id: appointmentId,
                appointmentNumber: appointmentNumber,
                bookedById: data.userId || null,
                sessionId: data.sessionId,
                isNewPatient: newPatient,
                patientName: data.patientName,
                patientEmail: data.patientEmail,
                patientPhone: data.patientPhone,
                patientNIC: data.patientNIC,
                patientGender: data.patientGender,
                patientAge: data.patientAge,
                medicalReportUrl: data.medicalReport || null,
                status: "CONFIRMED",
                consultationFee: consultationFee,
                totalAmount: consultationFee,
                paymentStatus: "PENDING",
                queuePosition: newQueuePosition,
                updatedAt: new Date(),
            },
        });

        return appointment;
    });
}

// get the appointments by user id
export async function getBookingsById(id: string) {
    return prisma.appointments.findMany({
        where: {
            bookedById: id,
        },
    });
}

// update the appointment by appoinment id
export async function updateBooking(id: string, data: any) {
    return await prisma.$transaction(async (tx) => {
        const appoinment = await tx.appointments.findUnique({
            where: {
                appointmentNumber: id,
            },
            include: {
                sessions: true,
            },
        });

        if (!appoinment || appoinment.sessions.status !== "SCHEDULED") {
            throw new Error("Session not available for updates");
        }

        const updatedBooking = await tx.appointments.update({
            where: {
                appointmentNumber: id,
            },
            data: {
                ...data,
                patientAge: data.patientAge,
                updatedAt: new Date(),
            },
        });
        return updatedBooking;
    });
}

// update payment status
export async function updatePaymentStatus(id: string) {
    return await prisma.$transaction(async (tx) => {
        // First, verify the appointment exists
        const appointment = await tx.appointments.findUnique({
            where: {
                appointmentNumber: id,
            },
            include: {
                sessions: true,
            },
        });

        if (!appointment) {
            throw new Error(`Appointment with number ${id} not found`);
        }

        if (appointment.sessions.status !== "SCHEDULED") {
            throw new Error("Session not available for updates");
        }

        // Prevent duplicate payment updates
        if (appointment.paymentStatus === "COMPLETED") {
            throw new Error(
                "Payment has already been completed for this appointment",
            );
        }

        // Update the existing appointment record
        const updatedBooking = await tx.appointments.update({
            where: {
                appointmentNumber: id, // Use the primary key for the update to ensure we're updating the exact record
            },
            data: {
                status: "CONFIRMED",
                paymentStatus: "COMPLETED",
                updatedAt: new Date(),
            },
            select: {
                id: true,
                appointmentNumber: true,
                bookedById: true,
                sessionId: true,
                isNewPatient: true,
                patientName: true,
                patientEmail: true,
                patientPhone: true,
                patientNIC: true,
                patientGender: true,
                patientAge: true,
                medicalReportUrl: true,
                status: true,
                consultationFee: true,
                totalAmount: true,
                paymentStatus: true,
                queuePosition: true,
                createdAt: true,
                updatedAt: true,
                sessions: {
                    select: {
                        scheduledAt: true,
                        startTime: true,
                        doctors: {
                            select: {
                                name: true,
                            },
                        },
                        hospitals: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return updatedBooking;
    });
}
