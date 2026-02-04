"use client";
import React, { useState, useEffect } from 'react'; // CHANGED: Added useEffect

// Appointment type definition
interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  hospital: string;
  type: 'In-Person' | 'Telehealth';
  status: 'upcoming' | 'past' | 'cancelled';
}


const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const statusColor = {
    upcoming: "bg-blue-100 text-blue-700 border-blue-300",
    past: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
  }[appointment.status];

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-7 shadow-lg hover:shadow-2xl overflow-hidden">
      {/* Badge for appointment status */}
      <div
        className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}
      >
        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      </div>

      <div className="flex items-center space-x-5 mb-5">
        {/* Avatar/Initials */}
        <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-[20px] font-bold text-blue-700 tracking-wide">
            {appointment.doctorName
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
            }
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-bold text-gray-900">{appointment.doctorName}</h3>
          <p className="text-blue-700 text-sm font-medium">{appointment.specialization}</p>
          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
            {appointment.type}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-5 mt-2">
        {/* Date & Time */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 text-base">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-gray-800">Date:</span>
            <span className="text-gray-700">{appointment.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-base">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-gray-800">Time:</span>
            <span className="text-gray-700">{appointment.time}</span>
          </div>
        </div>

        {/* Patient */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 text-base">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1118.364 4.56M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-gray-800">Patient:</span>
            <span className="text-gray-700">{appointment.patientName}</span>
          </div>
        </div>

        {/* Hospital */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 text-base">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-semibold text-gray-800">Hospital:</span>
            <span className="text-gray-700">{appointment.hospital}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AppointmentsPage component - UPDATED
const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]); // CHANGED: Added state for appointments
  const [loading, setLoading] = useState(true); // CHANGED: Added loading state

  // CHANGED: Added useEffect to fetch data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appoinments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(app => app.status === activeTab);

  const appointmentCounts = {
    upcoming: appointments.filter(app => app.status === 'upcoming').length,
    past: appointments.filter(app => app.status === 'past').length,
    cancelled: appointments.filter(app => app.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your medical appointments</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { id: 'upcoming', label: 'Upcoming', count: appointmentCounts.upcoming },
            { id: 'past', label: 'Past', count: appointmentCounts.past },
            { id: 'cancelled', label: 'Cancelled', count: appointmentCounts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`
                  ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                  ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'}
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Appointments List - CHANGED: Added loading state */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No {activeTab} appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;