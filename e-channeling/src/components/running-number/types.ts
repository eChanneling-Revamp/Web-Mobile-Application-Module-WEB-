export type RunningNumberAppointment = {
  appointmentId: string;
  appointmentNumber: string | null;

  patientName: string;
  doctorName: string;
  hospitalName: string;

  sessionDate: string | null; // YYYY-MM-DD
  sessionStartTime: string | null; // HH:mm

  currentRunningNumber: number | null;
  yourNumber: number | null;
};

export type RunningNumberState = {
  phoneNumber: string;
  appointments: RunningNumberAppointment[];
  isLoadingAppointments: boolean;
  error: string | null;
};
