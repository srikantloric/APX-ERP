import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  LinearProgress,
  Option,
  Select,
  Table,
  ToggleButtonGroup,
} from "@mui/joy";
import UpdateStudentImageCard from "components/Card/UpdateStudentImageCard";
import { SCHOOL_CLASSES, SCHOOL_SECTIONS } from "config/schoolConfig";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { StudentDetailsType } from "types/student";

const StudentProfilePictureUpdater: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentDetailsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputSearch, setinputSearch] = useState<any>(null);

  const [tabSelected, setTabSelected] = useState<string>("byClass");

  const handleStudentFetching = () => {
    console.log(selectedClass, selectedSection);
    if (selectedSection === null || selectedClass === null) {
      enqueueSnackbar("Please select class & section", { variant: "error" });
    } else {
      setLoading(true);
      db.collection("STUDENTS")
        .where("class", "==", selectedClass)
        .where("section", "==", selectedSection)
        .onSnapshot((documentSnap) => {
          if (documentSnap.size > 0) {
            let tempArr: StudentDetailsType[] = [];
            documentSnap.forEach((student) => {
              const resData = student.data() as StudentDetailsType;
              tempArr.push(resData);
            });

            setStudentData(tempArr);
            setLoading(false);
          }else{
            enqueueSnackbar("No record found for selected class/section", {
              variant: "info",
            });
            setLoading(false)
          }
        });

  
    }
  };
  const handleseachbyid = () => {
    console.log(inputSearch);
    if (inputSearch === null) {
      enqueueSnackbar("Please Enter Valid Id", { variant: "error" });
    } else {
      db.collection("STUDENTS")
        .where("admission_no", "==", inputSearch)
        .get()
        .then((documentSnap) => {
          if (documentSnap.size > 0) {
            let tempArr: StudentDetailsType[] = [];
            documentSnap.forEach((student) => {
              const resData = student.data() as StudentDetailsType;
              tempArr.push(resData);
            });

            setStudentData(tempArr);
            console.log(studentData);
            setLoading(false);
          } else {
            setLoading(false);
           enqueueSnackbar("No student with this student ID!",{variant:"info"})
          }
        })
        .catch((e) => {
          enqueueSnackbar("INVALID STUDENT ID");
          setLoading(false);
        });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "8px",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--colour-background)",
        minHeight: "100vh",
      }}
    >
      <ToggleButtonGroup
        value={tabSelected}
        sx={{ marginTop: "10px", marginBottom: "10px" }}
        onChange={(event, newValue) => setTabSelected(newValue!)}
      >
        <Button value="byClass">Search By Class</Button>
        <Button value="byId">Search By ID</Button>
      </ToggleButtonGroup>
      <br />
      <center>
        {tabSelected === "byClass" ? (
          <>
            <Grid container spacing={2}>
              <Grid xs={4}>
                <Select
                  placeholder="Class"
                  defaultValue={null}
                  value={selectedClass}
                  onChange={(e, val) => setSelectedClass(val)}
                  required
                >
                  {SCHOOL_CLASSES.map((item, i) => {
                    return <Option value={item.value}>{item.title}</Option>;
                  })}
                </Select>
              </Grid>
              <Grid xs={4}>
                <Select
                  placeholder="Section"
                  defaultValue={null}
                  value={selectedSection}
                  onChange={(e, val) => setSelectedSection(val)}
                  required
                >
                  {SCHOOL_SECTIONS.map((item, i) => {
                    return <Option value={item.value}>{item.title}</Option>;
                  })}
                </Select>
              </Grid>
              <Grid xs={4}>
                <Button fullWidth onClick={handleStudentFetching}>
                  Search
                </Button>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <Box>
              {loading ? <LinearProgress thickness={3} /> : null}
              <br />
              <Table>
                <tbody>
                  {studentData &&
                    studentData.map((student, i) => {
                      return (
                        <tr
                        key={student.id}
                          style={{
                            padding: "8px 10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UpdateStudentImageCard
                            imageUrl={student.profil_url}
                            name={student.student_name}
                            father_name={student.father_name}
                            doc_id={student.id}
                            student_id={student.admission_no}
                            student_email={student.email}
                          />
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Box>
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid xs={8}>
                <Input
                  placeholder="Type Student ID..."
                  value={inputSearch}
                  onChange={(e) => setinputSearch(e.target.value)}
                />
              </Grid>

              <Grid xs={4}>
                <Button fullWidth onClick={handleseachbyid}>
                  Search
                </Button>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <Box>
              {loading ? <LinearProgress thickness={3} /> : null}
              <br />
              <Table>
                <tbody>
                  {studentData &&
                    studentData.map((student, i) => {
                      return (
                        <tr
                          style={{
                            padding: "8px 10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UpdateStudentImageCard
                            imageUrl={student.profil_url}
                            name={student.student_name}
                            father_name={student.father_name}
                            doc_id={student.id}
                            student_id={student.admission_no}
                            student_email={student.email}
                          />
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Box>
          </>
        )}
      </center>
    </div>
  );
};

export default StudentProfilePictureUpdater;
