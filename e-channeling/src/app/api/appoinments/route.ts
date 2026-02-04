import { NextResponse } from 'next/server';

export async function GET() {
  const appointments = [
    {
      id: '1',
      patientName: 'John Doe',
      doctorName: 'Dr. Samantha Perera',
      specialization: 'Cardiologist',
      date: '6/15/2023',
      time: '10:00 AM',
      hospital: 'National Hospital,',
      type: 'In-Person',
      status: 'upcoming',
    },
    {
      id: '2',
      patientName: 'John Doe',
      doctorName: 'Dr. Arjun Rajapakse',
      specialization: 'Dermatologist',
      date: '6/20/2023',
      time: '2:30 PM',
      hospital: 'City Hospital, Kandy',
      type: 'Telehealth',
      status: 'upcoming',
    },
    {
      id: '3',
      patientName: 'John Doe',
      doctorName: 'Dr. Priya Silva',
      specialization: 'Pediatrician',
      date: '5/10/2023',
      time: '9:00 AM',
      hospital: 'Children\'s Hospital, Colombo',
      type: 'In-Person',
      status: 'past',
    },
    {
      id: '4',
      patientName: 'John Doe',
      doctorName: 'Dr. Kumar Rana',
      specialization: 'Orthopedic Surgeon',
      date: '4/22/2023',
      time: '11:00 AM',
      hospital: 'General Hospital, Galle',
      type: 'In-Person',
      status: 'cancelled',
    },
  ];
  return NextResponse.json(appointments);
}