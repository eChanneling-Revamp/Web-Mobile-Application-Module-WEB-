"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Loader2 } from "lucide-react";

export const RunningNumberChecker: React.FC = () => {
  const { phoneNumber, appointments, isLoadingAppointments, error } =
    useSelector((state: RootState) => state.runningNumber);

  if (!phoneNumber) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Appointments for {phoneNumber}
      </h3>

      {isLoadingAppointments && (
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading appointments...</span>
        </div>
      )}

      {!isLoadingAppointments && error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {!isLoadingAppointments && !error && appointments.length === 0 && (
        <p className="text-gray-600">
          No ongoing sessions found for this number.
        </p>
      )}

      {!isLoadingAppointments && !error && appointments.length > 0 && (
        <div className="space-y-5 mt-6">
          {appointments.map((apt) => (
            <div
              key={apt.appointmentId}
              className="rounded-xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                <div className="p-5 bg-blue-50/70">
                  <p className="text-sm font-semibold text-gray-700">
                    Current Running Number
                  </p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">
                    {apt.currentRunningNumber ?? "-"}
                  </p>
                </div>

                <div className="p-5 bg-white border-y sm:border-y-0 sm:border-x border-gray-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Patient:</span>{" "}
                    {apt.patientName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Doctor:</span>{" "}
                    {apt.doctorName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Hospital:</span>{" "}
                    {apt.hospitalName}
                  </p>

                  {(apt.sessionDate || apt.sessionStartTime) && (
                    <p className="text-sm text-gray-600 mt-2">
                      {apt.sessionDate ?? ""}{" "}
                      {apt.sessionStartTime ? `• ${apt.sessionStartTime}` : ""}
                    </p>
                  )}
                </div>

                <div className="p-5 bg-green-50/70 flex sm:flex-col items-start sm:items-end justify-between sm:justify-start">
                  <p className="text-sm font-semibold text-gray-700">
                    Your Number
                  </p>
                  <p className="text-4xl font-bold text-green-600 mt-2 sm:mt-2">
                    {apt.yourNumber ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
