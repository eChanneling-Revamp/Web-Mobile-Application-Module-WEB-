export interface RunningNumberAppointment {
  appointmentId: string;
  doctorName: string;
  hospitalName: string;
  sessionDate: string;
  sessionStartTime: string;
  currentRunningNumber: number;
  yourNumber: number;
  patientName: string;
}

export interface RunningNumberState {
  phoneNumber: string;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  appointments: RunningNumberAppointment[];
  isLoadingAppointments: boolean;
  error: string | null;
}