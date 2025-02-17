import jsPDF from "jspdf";
import { admitCardType } from "types/admitCard";
import {
  SCHOOL_NAME,
  SCHOOL_ADDRESS,
  SCHOOL_WEBSITE,
} from "config/schoolConfig";
import { POPPINS_BOLD, POPPINS_REGULAR, POPPINS_SEMIBOLD } from "./Base64Url";
import { format } from "date-fns";

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
    doc.addImage(logoImg, "PNG", margin + 10, positionY + 10, 20, 20); // Adjust the position and size as needed

    doc.setFont("Poppins", "bold");
    doc.setFontSize(19);
    doc.text(SCHOOL_NAME, 105, positionY + 4, { align: "center" });

    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    doc.text(`${SCHOOL_ADDRESS} | ${SCHOOL_WEBSITE}`, 105, positionY + 11, {
      align: "center",
    });

    // Admit Card Title with Exam Title and Session
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, positionY + 12, 210 - 2 * margin, 6, "F");
    doc.setFont("Poppins", "semibold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `ADMIT CARD || ${studentData.examTitle} || Session: ${studentData.session}`,
      105,
      positionY + 17,
      { align: "center" }
    );
    doc.setTextColor(0, 0, 0);

    // Student Image
    const studentImg = new Image();
    studentImg.src = studentData.profile_url;
    doc.addImage(studentImg, "PNG", margin + 10, positionY + 32, 35, 45); // Passport size relative to A4
    doc.rect(margin + 10, positionY + 32, 35, 45);

    // Student Details
    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    let studentDetailsX = margin + 50;
    let timeTableX = 105; // Starting X position for the time table

    doc.text(
      `Name: ${studentData.studentName}`,
      studentDetailsX,
      positionY + 32
    );
    doc.text(
      `Class: ${studentData.className}`,
      studentDetailsX,
      positionY + 37
    );
    doc.text(
      `Roll Number: ${studentData.rollNumber}`,
      studentDetailsX,
      positionY + 42
    );

    // Exam Details
    doc.text(`Exam: ${studentData.examTitle}`, studentDetailsX, positionY + 47);
    doc.text(
      `Session: ${studentData.session}`,
      studentDetailsX,
      positionY + 52
    );
    doc.text(
      `Start Time: ${studentData.startTime}`,
      studentDetailsX,
      positionY + 57
    );
    doc.text(
      `End Time: ${studentData.endTime}`,
      studentDetailsX,
      positionY + 62
    );

    // Time Table
    doc.setFont("Poppins", "semibold");
    doc.setFontSize(10);
    let startY = positionY + 32;

    // Table Headers
    doc.text("Date", timeTableX, startY, { align: "center" });
    doc.text("1st Meeting", timeTableX + 30, startY, { align: "center" });
    doc.text("2nd Meeting", timeTableX + 70, startY, { align: "center" });

    // Table Rows
    studentData.timeTabel.forEach((item, index) => {
      const rowY = startY + (index + 1) * 8;
      const fillColor = index % 2 === 0 ? "#ccffcc" : "#ffffcc"; // Light green and light yellow
      doc.setFillColor(fillColor);
      doc.rect(timeTableX - 2, rowY - 6, 100, 8, "F");
      doc.text(format(item.date, "dd MMM yyyy"), timeTableX, rowY, {
        align: "center",
      });
      doc.text(item.firstMeeting, timeTableX + 30, rowY, { align: "center" });
      doc.text(item.secondMeeting, timeTableX + 70, rowY, { align: "center" });
    });

    // Signatures
    const signatureY = positionY + cardHeight - 20;
    doc.setFont("Poppins", "normal");
    doc.setFontSize(10);
    doc.text("Exam Controller", margin + 20, signatureY);
    doc.text("Class Teacher", 85, signatureY);
    doc.text("Director", 150, signatureY);
  });

  // Save the PDF
  doc.save("AdmitCard.pdf");
};
