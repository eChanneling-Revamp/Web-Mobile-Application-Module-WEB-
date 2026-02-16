import prisma from "@/lib/db/prisma";

function buildSriLankaPhoneVariants(input: string) {
  const cleaned = input.trim().replace(/\s+/g, "");

  // digits only
  const digits = cleaned.replace(/[^\d]/g, "");

  // Convert any format to the last 9 digits "7XXXXXXXX"
  // 07XXXXXXXX -> digits 0712345678 -> last9 712345678
  // +94XXXXXXXXX -> digits 94712345678 -> last9 712345678
  // 94XXXXXXXXX -> digits 94712345678 -> last9 712345678
  const last9 = digits.slice(-9);

  if (!/^7\d{8}$/.test(last9)) {
    // fallback, but validation should prevent this
    return Array.from(new Set([cleaned]));
  }

  const local = `0${last9}`;      // 0712345678
  const intl = `94${last9}`;      // 94712345678
  const e164 = `+94${last9}`;     // +94712345678

  // Include the user-entered cleaned version too
  return Array.from(new Set([cleaned, local, intl, e164]));
}

export async function getRunningNumbersByPhone(phone: string) {
  const phoneVariants = buildSriLankaPhoneVariants(phone);

  const appointments = await prisma.appointment.findMany({
    where: {
      patientPhone: { in: phoneVariants },

      //status: "WAITING",
      //Error : "WAITING" is not assignable to type 'AppointmentStatus'

      session: {
        status: "ONGOING",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      appointmentNumber: true,
      patientName: true,
      patientPhone: true,
      queuePosition: true,
      estimatedWaitTime: true,
      createdAt: true,
      session: {
        select: {
          currentRunningNumber: true,
          scheduledAt: true,
          startTime: true,
          doctors: { select: { name: true } },
          hospitals: { select: { name: true } },
        },
      },
    },
  });

  return appointments.map((apt) => {
    const session = apt.session;

    const currentRunningNumberRaw = session?.currentRunningNumber ?? null;
    const currentRunningNumber =
      currentRunningNumberRaw === null
        ? null
        : Number.isFinite(Number(currentRunningNumberRaw))
        ? Number(currentRunningNumberRaw)
        : null;

    const yourNumber =
      typeof apt.queuePosition === "number"
        ? apt.queuePosition
        : typeof apt.estimatedWaitTime === "number"
        ? apt.estimatedWaitTime
        : null;

    return {
      appointmentId: apt.id,
      appointmentNumber: apt.appointmentNumber ?? null,
      patientName: apt.patientName ?? "N/A",
      patientPhone: apt.patientPhone ?? null,

      doctorName: session?.doctors?.name ?? "N/A",
      hospitalName: session?.hospitals?.name ?? "N/A",

      sessionDate: session?.scheduledAt
        ? new Date(session.scheduledAt).toISOString().slice(0, 10)
        : null,

      sessionStartTime: session?.startTime
        ? new Date(session.startTime).toISOString().slice(11, 16)
        : null,

      currentRunningNumber,
      yourNumber,
    };
  });
}
