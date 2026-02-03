export const getReceiptHtml = (appointment: any) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Appointment Confirmation</title>
    </head>

    <body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
        <td align="center" style="padding:40px 15px;">

            <table width="600" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:14px;
            overflow:hidden;
            box-shadow:0 6px 20px rgba(0,0,0,0.06);
            ">

            <!-- Header Section -->
            <tr>
                <td style="background:linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);padding:35px 40px;text-align:center;">
                <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:600;">
                    ✓ Appointment Confirmed
                </h1>
                <p style="margin:8px 0 0 0;font-size:15px;color:#e3f2ff;">
                    Your appointment has been successfully booked
                </p>
                </td>
            </tr>

            <!-- Main Content -->
            <tr>
                <td style="padding:40px;">

                <!-- Greeting -->
                <p style="margin:0;font-size:16px;color:#333;line-height:1.6;">
                    Dear <strong>${appointment.patientName || 'Patient'}</strong>,
                </p>

                <p style="margin:15px 0 30px 0;font-size:15px;color:#555;line-height:1.6;">
                    Thank you for choosing eChanneling. Your appointment has been confirmed. Please find your appointment details below:
                </p>

                <!-- Appointment Details Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="
                    background:#f8f9fa;
                    border-radius:10px;
                    border:1px solid #e9ecef;
                    margin-bottom:25px;
                ">
                    <tr>
                    <td style="padding:25px;">

                        <!-- Appointment Number -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
                        <tr>
                            <td style="font-size:13px;color:#6c757d;padding-bottom:4px;">
                            Appointment Number
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:18px;color:#0d6efd;font-weight:700;">
                            ${appointment.appointmentNumber || 'N/A'}
                            </td>
                        </tr>
                        </table>

                        <hr style="border:0;border-top:1px solid #dee2e6;margin:18px 0;">

                        <!-- Two Column Layout -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="50%" style="vertical-align:top;padding-right:15px;">

                            <!-- Hospital -->
                            <div style="margin-bottom:18px;">
                                <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                                🏥 Hospital
                                </div>
                                <div style="font-size:15px;color:#212529;font-weight:600;">
                                ${appointment.sessions.hospitals.name || 'N/A'}
                                </div>
                            </div>

                            <!-- Patient Name -->
                            <div style="margin-bottom:18px;">
                                <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                                👤 Patient Name
                                </div>
                                <div style="font-size:15px;color:#212529;font-weight:600;">
                                ${appointment.patientName || 'N/A'}
                                </div>
                            </div>

                            <!-- Patient NIC -->
                            <div style="margin-bottom:18px;">
                                <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                                🆔 Patient NIC
                                </div>
                                <div style="font-size:15px;color:#212529;font-weight:600;">
                                ${appointment.patientNIC || 'N/A'}
                                </div>
                            </div>

                            </td>
                            <td width="50%" style="vertical-align:top;padding-left:15px;">

                            <!-- Queue Position -->
                            <div style="margin-bottom:18px;">
                                <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                                📋 Queue Position
                                </div>
                                <div style="font-size:15px;color:#212529;font-weight:600;">
                                ${appointment.queuePosition || 'N/A'}
                                </div>
                            </div>

                            <!-- Doctor Name -->
                            <div style="margin-bottom:18px;">
                                <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                                👨‍⚕️ Doctor
                                </div>
                                <div style="font-size:15px;color:#212529;font-weight:600;">
                                ${appointment.sessions.doctors.name|| 'N/A'}
                                </div>
                            </div>

                            <!-- Date -->
                            <div style="margin-bottom:18px;">
                                <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                                📅 Date
                                </div>
                                <div style="font-size:15px;color:#212529;font-weight:600;">
                                ${appointment.sessions.scheduledAt ? new Date(appointment.sessions.scheduledAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>

                            </td>
                        </tr>
                        </table>

                        <hr style="border:0;border-top:1px solid #dee2e6;margin:18px 0;">

                        <!-- Time -->
                        <div style="margin-bottom:18px;">
                        <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                            ⏰ Time
                        </div>
                        <div style="font-size:15px;color:#212529;font-weight:600;">
                            ${appointment.sessions.startTime ? new Date(appointment.sessions.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </div>
                        </div>

                        <!-- Payment Status -->
                        <div>
                        <div style="font-size:12px;color:#6c757d;margin-bottom:4px;">
                            💳 Payment Status
                        </div>
                        <div style="display:inline-block;padding:6px 14px;border-radius:6px;font-size:13px;font-weight:600;
                            ${appointment.paymentStatus === 'COMPLETED' || appointment.paymentStatus === 'SUCCESS'
            ? 'background:#d1f4e0;color:#0f5132;'
            : appointment.paymentStatus === 'PENDING'
                ? 'background:#fff3cd;color:#856404;'
                : 'background:#f8d7da;color:#842029;'}">
                            ${appointment.paymentStatus || 'PENDING'}
                        </div>
                        </div>

                    </td>
                    </tr>
                </table>

                <!-- Important Information -->
                <table width="100%" cellpadding="0" cellspacing="0" style="
                    background:#fff3cd;
                    border-left:4px solid #ffc107;
                    border-radius:6px;
                    margin-bottom:25px;
                ">
                    <tr>
                    <td style="padding:18px 20px;">
                        <div style="font-size:14px;color:#856404;font-weight:600;margin-bottom:8px;">
                        ⚠️ Important Information
                        </div>
                        <ul style="margin:0;padding-left:20px;font-size:14px;color:#856404;line-height:1.7;">
                        <li>Please arrive at least 15 minutes before your appointment time</li>
                        <li>Bring a valid ID and any relevant medical records</li>
                        <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                        </ul>
                    </td>
                    </tr>
                </table>

                <!-- Next Steps -->
                <div style="margin-bottom:25px;">
                    <h3 style="margin:0 0 15px 0;font-size:18px;color:#212529;font-weight:600;">
                    What's Next?
                    </h3>
                    <div style="font-size:14px;color:#555;line-height:1.7;">
                    <p style="margin:0 0 10px 0;">
                        ✓ You will receive a reminder notification before your appointment
                    </p>
                    <p style="margin:0 0 10px 0;">
                        ✓ You can view your appointment details anytime in your account
                    </p>
                    <p style="margin:0;">
                        ✓ For any questions, feel free to contact our support team
                    </p>
                    </div>
                </div>

                <!-- Call to Action Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <td align="center" style="padding:10px 0 20px 0;">
                        <a href="${appointment.appointmentUrl || '#'}" style="
                        display:inline-block;
                        padding:14px 32px;
                        background:#0d6efd;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:8px;
                        font-size:15px;
                        font-weight:600;
                        box-shadow:0 4px 12px rgba(13,110,253,0.25);
                        ">
                        View Appointment Details
                        </a>
                    </td>
                    </tr>
                </table>

                <!-- Support Information -->
                <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin-top:20px;">
                    <p style="margin:0 0 10px 0;font-size:14px;color:#495057;font-weight:600;">
                    Need Help?
                    </p>
                    <p style="margin:0;font-size:13px;color:#6c757d;line-height:1.6;">
                    If you have any questions or concerns, please don't hesitate to contact us at 
                    <a href="mailto:support@echanneling.com" style="color:#0d6efd;text-decoration:none;">support@echanneling.com</a> 
                    or call us at <strong>+94 11 123 4567</strong>
                    </p>
                </div>

                </td>
            </tr>

            <!-- Divider -->
            <tr>
                <td style="padding:0 40px;">
                <hr style="border:0;border-top:1px solid #e9ecef;margin:0;">
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td align="center" style="padding:30px 40px;">
                <p style="margin:0 0 8px 0;font-size:13px;color:#6c757d;">
                    Thank you for choosing eChanneling
                </p>
                <p style="margin:0;font-size:12px;color:#adb5bd;">
                    © ${new Date().getFullYear()} eChanneling. All rights reserved.
                </p>
                </td>
            </tr>

            </table>

        </td>
        </tr>
    </table>
    </body>
    </html>

    `;
}
