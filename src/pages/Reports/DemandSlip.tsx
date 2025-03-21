import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { IconReport } from "@tabler/icons-react";
import { Paper } from "@mui/material";
import { Box, Button, Chip, Option, Select, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import { db } from "../../firebase";
import { DueRecieptPropsType, StudentDetailsType } from "types/student";
import { getClassNameByValue } from "utilities/UtilitiesFunctions";
import { GenerateDemandSlip } from "utilities/GenerateDemandSlip";

const DemandSlip = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [studentData, setStudentData] = useState<DueRecieptPropsType[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateDemandSlip = async () => {
    if (!selectedClass) {
      alert("Please select exam and class!");
      return;
    }

    setLoading(true);

    try {
      const studentSnapshot = await db
        .collection("STUDENTS")
        .where("class", "==", selectedClass)
        .get();

      const studentData: DueRecieptPropsType[] = studentSnapshot.docs.map(
        (doc) => {
          const student = doc.data() as StudentDetailsType;
          return {
            reciept_id: "REC12345",
            current_session: "2024-25",
            due_date: new Date().toLocaleDateString(),
            due_month: "January",
            student_name: student.student_name,
            class:
              student.class !== null
                ? getClassNameByValue(student.class) || "N/A"
                : "N/A",
            father_name: student.father_name,
            dob: student.dob,
            phone_number: parseInt(student.contact_number),
            roll_number: parseInt(student.class_roll),
            admission_no: student.admission_no,
            section: student.section,
            address: student.address,
            fee_heads: [
              { title: "Monthly Fee", value: student.monthly_fee || 0 },
              { title: "Computer Fee", value: student.computer_fee || 0 },
              {
                title: "Transportation Fee",
                value: student.transportation_fee || 0,
              },
            ],
            note: "Please pay the due amount before the due date.",
          };
        }
      );

      setStudentData(studentData);
      const pdfUrl = await GenerateDemandSlip(studentData);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Failed to generate demand slip. Please try again.");
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2 Icon={IconReport} Path="Reports/Demand Slip" />

        <br />
        <Paper sx={{ p: "10px", mt: "8px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography level="title-md">Demand Slip</Typography>
            </Box>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Select
                placeholder="Choose class"
                value={selectedClass}
                onChange={(e, val) => setSelectedClass(val)}
              >
                {SCHOOL_CLASSES.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>

              <Button
                sx={{ ml: "8px" }}
                onClick={handleGenerateDemandSlip}
                loading={loading}
              >
                Generate Demand Slip
              </Button>
            </Stack>
          </Stack>
        </Paper>
        {pdfUrl && (
          <>
            <Chip sx={{ mt: "8px", mb: "8px" }}>
              Total demand slip count :{studentData.length}
            </Chip>
            <Paper sx={{ height: "100vh" }}>
              <iframe
                src={pdfUrl}
                title="PDF Viewer"
                width="100%"
                height="100%"
                frameBorder={0}
              />
            </Paper>
          </>
        )}
      </LSPage>
    </PageContainer>
  );
};

export default DemandSlip;
