// src/app/profile/payments-history/page.tsx
"use client";
import React from 'react';

interface PaymentRecord {
  id: string;
  doctorName: string;
  bankName: string;
  fee: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

const PaymentsHistoryPage: React.FC = () => {
  const payments: PaymentRecord[] = [
    { id: '1', doctorName: 'Dr. Samantha Perera', bankName: 'Commercial Bank', fee: 2500, date: '2023-06-15', status: 'completed' },
    { id: '2', doctorName: 'Dr. Arjun Rajapakse', bankName: 'HSBC', fee: 1800, date: '2023-06-20', status: 'completed' },
    { id: '3', doctorName: 'Dr. Priya Silva', bankName: 'NDB Bank', fee: 2000, date: '2023-05-10', status: 'refunded' },
    { id: '4', doctorName: 'Dr. Kumar Rana', bankName: 'Sampath Bank', fee: 3000, date: '2023-04-22', status: 'pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">View your payment and refund records</p>
      </div>

      {/* Payment History Cards - Full Width */}
      <div className="flex flex-col gap-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="w-full bg-white rounded-xl shadow p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-500">Appointment Number</span>
                <span className="text-[16px] font-semibold text-gray-900">APPT-2023-00{payment.id}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-500">Doctor</span>
                <span className="text-[16px] font-semibold text-gray-900">{payment.doctorName}</span>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 w-full">
              <div>
                <span className="block text-[14px] text-gray-500 font-medium">Bank Name</span>
                <span className="block text-[16px] font-semibold mt-1 text-gray-800">{payment.bankName}</span>
              </div>
              <div>
                <span className="block text-[14px] text-gray-500 font-medium">Date</span>
                <span className="block text-[16px] font-semibold mt-1 text-gray-800">{payment.date}</span>
              </div>
              <div>
                <span className="block text-[14px] text-gray-500 font-medium">Fee</span>
                <span className="block text-[16px] font-semibold mt-1 text-gray-800">LKR {payment.fee.toFixed(2)}</span>
              </div>
              <div className="flex md:hidden items-center">
                {/* Optionally add a mobile-only status indicator or icon here if needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsHistoryPage;