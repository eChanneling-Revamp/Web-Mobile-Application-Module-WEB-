import prisma from "@/lib/db/prisma";

export default async function getSessionsByDoctorId(id: string) {
    return await prisma.session.findMany({
        where: {
            doctorId: id,
            status: "SCHEDULED",
        },
        include: {
            hospitals: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}
