import { SCHOOL_ADDRESS, SCHOOL_NAME, SCHOOL_WEBSITE } from "config/schoolConfig";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { POPPINS_BOLD, POPPINS_REGULAR, POPPINS_SEMIBOLD } from "utilities/Base64Url";

function PdfLivePreview() {
    const [pdfUrl, setPdfUrl] = useState<string>("");

    const generatePdf = () => {
        const doc = new jsPDF({
            orientation: "landscape",
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


        const margin = 5; // Margin around the page
        const posY = margin + 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Set border color (black)
        doc.setDrawColor(0, 0, 0);

        // Draw border: Adjust width and height to fit within the page
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

        // School Header
        doc.setFont("Poppins", "bold");
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 139);
        doc.text(SCHOOL_NAME, pageWidth / 2, posY + 4, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFont("Poppins", "normal");
        doc.setFontSize(8);
        doc.text(`${SCHOOL_ADDRESS}  |  ${SCHOOL_WEBSITE}`, pageWidth / 2, posY + 11, {
            align: "center",
        });
        // Admit Card Title with Exam Title and Session
        doc.setFillColor(0, 0, 0);
        doc.rect(margin, posY + 15, pageWidth - 2 * margin, 10, "F");
        doc.setFont("Poppins", "semibold");
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text(
            `ADMIT CARD ||  || Session: `,
            pageWidth / 2,
            posY + 22,
            { align: "center" }
        );

        // Generate PDF Blob and create URL
        const pdfBlob = doc.output("blob");
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
    };

    // Auto-generate PDF on component mount
    useEffect(() => {
        generatePdf();
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
            }}
        >
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                ></iframe>
            )}
        </div>
    );
}

export default PdfLivePreview;
