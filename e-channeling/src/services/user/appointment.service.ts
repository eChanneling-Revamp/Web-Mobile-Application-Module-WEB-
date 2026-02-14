import prisma from "@/lib/db/prisma";

// get the appointments by user id
export async function getBookingsById(id: string) {
    return await prisma.appointment.findMany({
        where: {
            bookedById: id,
        },
        select: {
            id: true,
            appointmentNumber: true,
            patientName: true,
            patientEmail: true,
            patientPhone: true,
            patientGender: true,
            patientAge: true,
            session: {
                select: {
                    scheduledAt: true,
                    startTime: true,
                    endTime: true,
                    doctors: {
                        select: {
                            name: true,
                            specialization: true,
                            hospitals: {
                                select: {
                                    hospital: {
                                        select: {
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            },
            status: true,
            consultationFee: true,
            totalAmount: true,
            paymentStatus: true,
            queuePosition: true,
            notes: true,
            medicalReportUrl: true,
            allergies: true,
        }
    });
}

