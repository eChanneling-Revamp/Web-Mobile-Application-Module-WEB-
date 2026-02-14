import prisma from "@/lib/db/prisma";

export async function getHealthRecordsById(id: string) {
    return await prisma.appointment.findMany({
        where: {
            bookedById: id,
        },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            appointmentNumber: true,
            patientName: true,
            session: {
                select: {
                    doctors: {
                        select: {
                            name: true,
                            specialization: true
                        }
                    },
                    scheduledAt: true,
                    startTime: true,

                }
            },
            prescriptions: {
                select: {
                    prescriptionNumber: true,
                    htmlContent: true,
                }
            }
        }
    });
}