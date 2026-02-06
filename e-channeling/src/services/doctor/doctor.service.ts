import prisma from "@/lib/db/prisma";

export default async function getDoctorById(id: string) {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: {
            hospitals: {
                select: {
                    hospital: {
                        select: {
                            name: true,
                            city: true,
                        },
                    },
                },
            },
        },
    });

    if (doctor) {
        const { hospitals, ...doctorData } = doctor;
        const hospitalDetails = hospitals.map((h) => h.hospital);
        return { ...doctorData, hospitals: hospitalDetails };
    }

    return doctor;
}
