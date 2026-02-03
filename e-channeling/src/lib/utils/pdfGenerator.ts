import jsPDF from "jspdf";

interface AppointmentReceiptData {
    appointmentNumber: string;
    appointmentId: string;
    hospitalName: string;
    queuePosition: number;
    patientName: string;
    patientNIC: string;
    doctorName: string;
    sessionDate: string;
    sessionTime: string;
    consultationFee: number;
    platformFee: number;
    paymentStatus: string;
}

/**
 * Format date for PDF display (DD/MM/YYYY)
 */
const formatDateForPDF = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

/**
 * Format time for PDF display (12-hour format with AM/PM)
 */
const formatTimeForPDF = (timeStr: string): string => {
    const time = new Date(timeStr);
    return time.toLocaleTimeString("en-LK", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

/**
 * Generate and download appointment receipt as PDF
 */
export const generateAppointmentReceipt = (data: AppointmentReceiptData): void => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Receipt", 105, 20, { align: "center" });

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let yPos = 40;
    const lineHeight = 10;

    // Appointment Details
    doc.text(`Appointment Number: ${data.appointmentNumber}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Hospital: ${data.hospitalName}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Queue Position: #${data.queuePosition}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Patient Name: ${data.patientName}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Patient NIC: ${data.patientNIC}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Doctor Name: ${data.doctorName}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Date: ${formatDateForPDF(data.sessionDate)}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Time: ${formatTimeForPDF(data.sessionTime)}`, 20, yPos);
    yPos += lineHeight + 10;

    // Payment Summary
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary:", 20, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(
        `Consultation Fee: Rs. ${Number(data.consultationFee).toFixed(2)}`,
        20,
        yPos
    );
    yPos += lineHeight;

    doc.text(`Platform Fee: Rs. ${Number(data.platformFee).toFixed(2)}`, 20, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    const totalAmount = Number(data.consultationFee) + Number(data.platformFee);
    doc.text(
        `Total Amount Paid: Rs. ${totalAmount.toFixed(2)}`,
        20,
        yPos
    );
    yPos += lineHeight;

    doc.text(`Payment Status: ${data.paymentStatus}`, 20, yPos);
    yPos += lineHeight + 10;

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
        "Thank you for booking with eChannelling by SLT Mobitel!",
        105,
        yPos,
        { align: "center" }
    );

    // Save PDF
    doc.save(`Appointment_${data.appointmentNumber}.pdf`);
};
