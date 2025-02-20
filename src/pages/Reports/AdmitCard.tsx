import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { IconReport } from "@tabler/icons-react";
import { Paper } from "@mui/material";
import { Box, Button, Option, Select, Stack, Typography } from "@mui/joy";
import { admitCardType } from "types/admitCard";
import { useState } from "react";
import { SCHOOL_CLASSES, SCHOOL_SESSIONS } from "config/schoolConfig";
import { generateAdmitCard } from "../../utilities/GenerateAdmitCard";
import { db } from "../../firebase";
import { StudentDetailsType } from "types/student";
import { getClassNameByValue } from "utilities/UtilitiesFunctions";

const AdmitCard = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateAdmitCard = async () => {
    if (!selectedClass || !selectedSession) {
      alert("Please select class and session!");
      return;
    }

    setLoading(true);

    try {
      const studentSnapshot = await db
        .collection("STUDENTS")
        .where("class", "==", selectedClass)
        .get();

      const studentData: admitCardType[] = studentSnapshot.docs.map((doc) => {
        const student = doc.data() as StudentDetailsType;
        return {
          examTitle: "Mid Sem",
          session: selectedSession,
          startTime: "7am",
          endTime: "10am",
          studentName: student.student_name,
          fatherName: student.father_name,
          rollNumber: student.class_roll,
          studentDOB: student.dob,
          studentMob: student.contact_number,
          className:
            student.class !== null
              ? getClassNameByValue(student.class) || "Unknown"
              : "Unknown",
          profile_url: student.profil_url,
          timeTabel: [
            {
              date: new Date(),
              firstMeeting: "Math",
              secondMeeting: "Science",
            },
            {
              date: new Date(),
              firstMeeting: "English",
              secondMeeting: "History",
            },
            {
              date: new Date(),
              firstMeeting: "SST",
              secondMeeting: "Physics",
            },
            {
              date: new Date(),
              firstMeeting: "---",
              secondMeeting: "Chemistry",
            },
          ],
        };
      });

      await generateAdmitCard(studentData);
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Failed to generate admit card. Please try again.");
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2 Icon={IconReport} Path="Reports/Admit Card" />

        <br />
        <Paper sx={{ p: "10px", mt: "8px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography level="title-md">Admit Card</Typography>
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

              <Select
                placeholder="Choose session"
                value={selectedSession}
                onChange={(e, val) => setSelectedSession(val)}
              >
                {SCHOOL_SESSIONS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>

              <Button
                sx={{ ml: "8px" }}
                onClick={handleGenerateAdmitCard}
                loading={loading}
              >
                Generate Admit Card
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </LSPage>
    </PageContainer>
  );
};

export default AdmitCard;
