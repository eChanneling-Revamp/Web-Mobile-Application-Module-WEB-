"use client";
import React from 'react';
import { DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface HealthRecord {
  id: string;
  appointmentId: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  hasReports: boolean;
  hasPrescription: boolean;
}

export default function HealthRecordsPage() {
  const healthRecords: HealthRecord[] = [
    {
      id: '1',
      appointmentId: 'APPT-2023-001',
      date: '2023-06-15',
      time: '10:00 AM',
      doctorName: 'Dr. Samantha Perera',
      specialty: 'Cardiologist',
      hasReports: true,
      hasPrescription: true,
    },
    {
      id: '2',
      appointmentId: 'APPT-2023-002',
      date: '2023-05-10',
      time: '2:30 PM',
      doctorName: 'Dr. Arjun Rajapakse',
      specialty: 'Dermatologist',
      hasReports: true,
      hasPrescription: true,
    },
    {
      id: '3',
      appointmentId: 'APPT-2023-003',
      date: '2023-04-22',
      time: '9:00 AM',
      doctorName: 'Dr. Priya Silva',
      specialty: 'Pediatrician',
      hasReports: false,
      hasPrescription: true,
    },
  ];

  const handleViewReports = (recordId: string) => {
    console.log(`View reports for record: ${recordId}`);
    // Implement view reports functionality
    alert(`Viewing medical reports for appointment ${recordId}`);
  };

  const handleDownloadPrescription = (recordId: string) => {
    console.log(`Download prescription for record: ${recordId}`);
    // Implement download prescription functionality
    alert(`Downloading prescription for appointment ${recordId}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">View your medical history and reports</p>
      </div>

      {/* Health Records List */}
      <div className="space-y-8">
        {healthRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-1">
              {/* Appointment ID and Date/Time */}
              <div className="flex flex-col gap-3">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Appointment Number</span>
                  <p className="text-gray-900 font-semibold mt-1">{record.appointmentId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Appointment date and time
                  </span>
                  <p className="text-gray-900 mt-2">{record.date} • {record.time}</p>
                </div>
              </div>

              {/* Doctor Name */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">Doctor name</span>
                <p className="text-gray-900 font-semibold">{record.doctorName}</p>
              </div>

              {/* Specialty */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">Specialty</span>
                <p className="text-gray-900">{record.specialty}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-300">
              <button
                onClick={() => handleViewReports(record.id)}
                disabled={!record.hasReports}
                className={`group transition-all duration-150 flex items-center px-5 py-2.5 rounded-lg font-semibold shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-200
                  ${
                    record.hasReports
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300 border-blue-200'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }
                `}
              >
                <DocumentTextIcon
                  className={`w-5 h-5 mr-2 transition-colors duration-150 ${
                    record.hasReports ? 'text-blue-500 group-hover:text-blue-700' : 'text-gray-300'
                  }`}
                />
                View Medical Reports
              </button>

              <button
                onClick={() => handleDownloadPrescription(record.id)}
                disabled={!record.hasPrescription}
                className={`group transition-all duration-150 flex items-center px-5 py-2.5 rounded-lg font-semibold shadow-sm border focus:outline-none focus:ring-2 focus:ring-green-200
                  ${
                    record.hasPrescription
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300 border-green-200'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }
                `}
              >
                <DocumentArrowDownIcon
                  className={`w-5 h-5 mr-2 transition-colors duration-150 ${
                    record.hasPrescription ? 'text-green-500 group-hover:text-green-700' : 'text-gray-300'
                  }`}
                />
                Download Prescription
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Records Message */}
      {healthRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No health records found</h3>
          <p className="text-gray-500">Your health records will appear here after appointments.</p>
        </div>
      )}
    </div>
  );
}