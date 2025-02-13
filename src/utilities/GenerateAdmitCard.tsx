import jsPDF from "jspdf";
import { admitCardType } from "types/admitCard";
import { SCHOOL_NAME, SCHOOL_ADDRESS } from "config/schoolConfig";
import { POPPINS_BOLD, POPPINS_REGULAR, POPPINS_SEMIBOLD } from "./Base64Url";

export const generateAdmitCard = async (data: admitCardType[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Load fonts
  doc.addFileToVFS("Poppins-Bold", POPPINS_BOLD);
  doc.addFont("Poppins-Bold", "Poppins", "bold");

  doc.addFileToVFS("Poppins-Regular", POPPINS_REGULAR);
  doc.addFont("Poppins-Regular", "Poppins", "normal");

  doc.addFileToVFS("Poppins-Semibold", POPPINS_SEMIBOLD);
  doc.addFont("Poppins-Semibold", "Poppins", "semibold");

  const cardHeight = 297 / 3; // A4 height divided by 3
  const margin = 5; // Margin around the admit card

  data.forEach((studentData, index) => {
    const positionY = (index % 3) * cardHeight + margin;

    if (index > 0 && index % 3 === 0) {
      doc.addPage();
    }

    // Border around admit card
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, positionY - margin, 210 - 2 * margin, cardHeight - margin);

    // School Header
    const logoImg = new Image();
    logoImg.src = "/path/to/logo.png"; // Update with the correct path to the logo
    // doc.addImage(logoImg, "PNG", margin + 10, positionY + 10, 20, 20); // Adjust the position and size as needed

    doc.setFont("Poppins", "bold");
    doc.setFontSize(18);
    doc.text(SCHOOL_NAME, 105, positionY + 5, { align: "center" });

    doc.setFont("Poppins", "normal");
    doc.setFontSize(12);
    doc.text(SCHOOL_ADDRESS, 105, positionY + 10, { align: "center" });

    // Admit Card Title with Exam Title and Session
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, positionY + 15, 210 - 2 * margin, 10, "F");
    doc.setFont("Poppins", "semibold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `ADMIT CARD || ${studentData.examTitle} || Session: ${studentData.session}`,
      105,
      positionY + 23,
      { align: "center" }
    );
    doc.setTextColor(0, 0, 0);

    // Student Details
    doc.setFont("Poppins", "normal");
    doc.setFontSize(12);
    let studentDetailsX = margin + 20;
    let timeTableX = 120; // Starting X position for the time table

    doc.text(
      `Name: ${studentData.studentName}`,
      studentDetailsX,
      positionY + 35
    );
    doc.text(
      `Class: ${studentData.className}`,
      studentDetailsX,
      positionY + 40
    );
    doc.text(
      `Roll Number: ${studentData.rollNumber}`,
      studentDetailsX,
      positionY + 45
    );

    // Exam Details
    doc.text(`Exam: ${studentData.examTitle}`, studentDetailsX, positionY + 50);
    doc.text(
      `Session: ${studentData.session}`,
      studentDetailsX,
      positionY + 55
    );
    doc.text(
      `Start Time: ${studentData.startTime}`,
      studentDetailsX,
      positionY + 60
    );
    doc.text(
      `End Time: ${studentData.endTime}`,
      studentDetailsX,
      positionY + 65
    );

    // Time Table
    doc.setFont("Poppins", "normal");
    doc.setFontSize(12);
    let startY = positionY + 70;

    // Table Headers
    doc.text("Date", timeTableX, startY);
    doc.text("First Meeting", timeTableX + 40, startY);
    doc.text("Second Meeting", timeTableX + 100, startY);

    // Table Rows
    studentData.timeTabel.forEach((item, index) => {
      const rowY = startY + (index + 1) * 8;
      const fillColor = index % 2 === 0 ? "#ccffcc" : "#ffffcc"; // Light green and light yellow
      doc.setFillColor(fillColor);
      doc.rect(timeTableX - 2, rowY - 6, 150, 8, "F");
      doc.text(item.date.toDateString(), timeTableX, rowY);
      doc.text(item.firstMeeting, timeTableX + 40, rowY);
      doc.text(item.secondMeeting, timeTableX + 100, rowY);
    });

    // Signatures
    const signatureY = positionY + 110;
    doc.setFont("Poppins", "normal");
    doc.setFontSize(12);
    doc.text("Exam Controller", margin + 20, signatureY);
    doc.text("Class Teacher", 85, signatureY);
    doc.text("Director", 150, signatureY);
  });

  // Save the PDF
  doc.save("AdmitCard.pdf");
};
