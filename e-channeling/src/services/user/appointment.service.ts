import prisma from "@/lib/db/prisma";

// get the appointments by user id
export async function getBookingsById(id: string) {
    return await prisma.appointment.findMany({
        where: {
            bookedById: id,
        },
    });
}

// cancel the appointment by appointment id
export async function cancelBooking(id: string) {
    return await prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.findUnique({
            where: {
                id: id,
            },
        });

        if (!appointment) {
            throw new Error(`Appointment with ID ${id} not found`);
        }

        if (appointment.status === "CANCELLED") {
            throw new Error("Appointment is already cancelled");
        }

        const updatedBooking = await tx.appointment.update({
            where: {
                id: id,
            },
            data: {
                status: "CANCELLED",
                updatedAt: new Date(),
            },
        });
        return updatedBooking;
    });
}
