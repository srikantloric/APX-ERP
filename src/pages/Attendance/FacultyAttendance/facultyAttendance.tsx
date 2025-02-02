import Navbar from "components/Navbar/Navbar";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { Divider, LinearProgress, Paper } from "@mui/material";
import PageContainer from "components/Utils/PageContainer";
// import firebase from "firebase";
import SaveIcon from "@mui/icons-material/Save";
import firebase from "firebase";

import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Input,
  Option,
  Radio,
  RadioGroup,
  Select,
  Sheet,
  Table,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { getCurrentDate } from "utilities/UtilitiesFunctions";
import Search from "@mui/icons-material/Search";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import HeaderTitleCard from "components/Card/HeaderTitleCard";
import LSPage from "components/Utils/LSPage";

import { FacultyAttendanceShema } from "types/facuities";
import { enqueueSnackbar } from "notistack";
import { db } from "../../../firebase";

interface FacultyAttendanceType extends FacultyAttendanceShema {
  selected_option?: string | null;
  comment?: string;
}

export const FacultyAttendance = () => {
  const [FacultyData, setFacultyData] = useState<FacultyAttendanceType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavingDone, setSavingDone] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");

  useEffect(() => {
    setLoading(false);
    setIsSaving(false);
    setSavingDone(false);
    setMessageText("");
  }, []);

  const handleRadioSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    faculty: FacultyAttendanceType
  ) => {
    const updatedStudents = FacultyData.map((item) =>
      item.id === faculty.id
        ? { ...faculty, selected_option: e.target.value }
        : item
    );
    setFacultyData(updatedStudents);
  };

  const handleMarkAll = (val: string | null) => {
    const updatedStudent = FacultyData.map((item) => {
      return { ...item, selected_option: val };
    });
    setFacultyData(updatedStudent);
  };
  const fetchFacuility = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDate === null) {
      enqueueSnackbar("Please select date", { variant: "error" });
    } else {
      setLoading(true);
      setFacultyData([]);
      setMessageText("");

      
      const dateWithoutHypen: string[] = selectedDate.split("-");
      const facultyAttendanceDocId = `${dateWithoutHypen[0]}${dateWithoutHypen[1]}${dateWithoutHypen[2]}`;
      console.log(facultyAttendanceDocId)
      const result = await db
        .collection("FACULTY")
        .doc(facultyAttendanceDocId)
        .get();

      if (result.exists) {
        setMessageText(
          "Attendance for this class already marked, you can again save with updated attendance."
        );
        console.log("ughknloytfuyvoyiu");
      }

      db.collection("FACULTIES").onSnapshot((documentSnap: any) => {
        if (documentSnap.size > 0) {
          let tempArr: FacultyAttendanceType[] = [];
          documentSnap.forEach((faculty: any) => {
            const resData = faculty.data() as FacultyAttendanceType;
            resData["selected_option"] = "P";
            resData["comment"] = "";
            tempArr.push(resData);
          });

          setFacultyData(tempArr);
          console.log(FacultyData);
          setLoading(false);
          setSavingDone(false);
        } else {
          enqueueSnackbar("No record found", {
            variant: "info",
          });
          setLoading(false);
        }
      });
    }
  };
  const filteredfaculty = FacultyData.filter((faculty) => {
    const isMatchedByName = faculty.faculty_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return isMatchedByName;
  });
  const handleSaveAttendance = async () => {
    ///Building final attendance
    let tempAttArr: FacultyAttendanceType[] = [];
    let tempAttArrGlobalSave: FacultyAttendanceType[] = [];
   

    FacultyData.map((faculty) => {
     

      const attendanceDataForSave: FacultyAttendanceShema = {
        isSmartAttendance: false,
        faculty_name: faculty.faculty_name,
        id: faculty.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        comment: faculty.comment,
        attendanceDate: selectedDate,
        attendanceStatus: faculty.selected_option!,
      };
      const attendanceDataForGlobalSave: FacultyAttendanceShema = {
        isSmartAttendance: false,
        id: faculty.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        comment: faculty.comment,
        attendanceDate: selectedDate,
        attendanceStatus: faculty.selected_option!,

        faculty_name: faculty.faculty_name,

        faculty_image: faculty.faculty_image,
        faculty_phone: faculty.faculty_phone,
      };
      tempAttArr.push(attendanceDataForSave);
      tempAttArrGlobalSave.push(attendanceDataForGlobalSave);
    });

    setIsSaving(true);

    const dateWithoutHypen: string[] = selectedDate.split("-");
    for (let item of tempAttArr) {
      const facultyAttendanceDocId = `${dateWithoutHypen[0]}${dateWithoutHypen[1]}${dateWithoutHypen[2]}`;
      await db
        .collection("FACULTIES")
        .doc(item.id)
        .collection("ATTENDANCE")
        .doc(facultyAttendanceDocId)
        .set(item);
        
        
        
    }
    

    setSavingDone(true);
    setIsSaving(false);
    enqueueSnackbar("Attendance Saved Successfully!", { variant: "success" });
  };
  const handleAttendanceComment = (comment: string, id: string) => {
    const updatedStudents = FacultyData.map((item) =>
      item.id === id ? { ...item, comment } : item
    );
    setFacultyData(updatedStudents);
  };
  return (
    <>
      <PageContainer>
        <Navbar />
        <LSPage>
          <BreadCrumbsV2
            Icon={FingerprintIcon}
            Path="Attendance Management/Facuities Attendence"
          />

          <HeaderTitleCard Title="Mark Attendance Manually" />
          <Paper sx={{ p: 2, border: "1px solid var(--bs-gray-300)" }}>
            <Box
              component="form"
              onSubmit={fetchFacuility}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <FormControl>
                  <FormLabel>Select Date</FormLabel>
                  <Input
                    required
                    placeholder="Placeholder"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  {/* <FormHelperText>This is a helper text.</FormHelperText> */}
                </FormControl>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button sx={{ height: 20 }} type="submit">
                  Fetch
                </Button>
                {FacultyData.length > 0 ? (
                  <Button
                    startDecorator={<SaveIcon />}
                    sx={{ height: 20 }}
                    onClick={handleSaveAttendance}
                    color="success"
                    loading={isSaving}
                    disabled={isSavingDone}
                  >
                    Save
                  </Button>
                ) : null}
              </div>
            </Box>

            {messageText != "" ? (
              <>
                <br />
                <Chip color="warning" variant="soft">
                  Info: {messageText}
                </Chip>
                <br />
              </>
            ) : null}
            <br />
            {loading ? <LinearProgress /> : null}
            {FacultyData.length !== 0 ? (
              <>
                <Divider />
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Input
                    startDecorator={<Search />}
                    sx={{ flex: 0.6 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    defaultValue="P"
                    placeholder="Mark all as"
                    sx={{ minWidth: "200px" }}
                    onChange={(e, val) => handleMarkAll(val)}
                  >
                    <Option value="none">None </Option>
                    <Option value="P">Present</Option>
                    <Option value="A">Absent </Option>
                    <Option value="H">Holiday</Option>
                    <Option value="S">Sunday</Option>
                  </Select>
                </div>
                <br />
                <div>
                  <Table
                    aria-label="table variants"
                    variant="plain"
                    color="neutral"
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "150px" }}>ID</th>
                        <th>Faculities</th>
                        <th>Action</th>
                        <th style={{ textAlign: "right", width: "190px" }}>
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredfaculty &&
                        filteredfaculty.map((faculty, i) => {
                          return (
                            <tr key={faculty.id}>
                              <td>{faculty.faculty_phone}</td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <Avatar src={faculty.faculty_image} />
                                  {faculty.faculty_name}
                                </div>
                              </td>
                              <td>
                                <RadioGroup
                                  aria-labelledby="storage-label"
                                  value={faculty.selected_option}
                                  defaultValue="P"
                                  onChange={(e) =>
                                    handleRadioSelect(e, faculty)
                                  }
                                  size="sm"
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 3,
                                  }}
                                >
                                  {["P", "A", "H", "L", "S"].map((value) => (
                                    <Sheet
                                      key={value}
                                      sx={{
                                        p: 1.5,
                                        borderRadius: "md",
                                        boxShadow: "sm",
                                      }}
                                    >
                                      <Radio
                                        label={value}
                                        overlay
                                        disableIcon
                                        value={value}
                                        slotProps={{
                                          label: ({ checked }) => ({
                                            sx: {
                                              fontWeight: "lg",
                                              fontSize: "sm",

                                              color: checked
                                                ? "text.primary"
                                                : "text.secondary",
                                            },
                                          }),
                                          action: ({ checked }) => ({
                                            sx: (theme) => ({
                                              ...(checked && {
                                                "--variant-borderWidth": "2px",
                                                "&&": {
                                                  // && to increase the specificity to win the base :hover styles
                                                  borderColor:
                                                    theme.vars.palette
                                                      .primary[500],
                                                },
                                              }),
                                            }),
                                          }),
                                        }}
                                      />
                                    </Sheet>
                                  ))}
                                </RadioGroup>
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  onChange={(e) =>
                                    handleAttendanceComment(
                                      e.target.value,
                                      faculty.id
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </>
            ) : null}
          </Paper>
        </LSPage>
      </PageContainer>
    </>
  );
};
