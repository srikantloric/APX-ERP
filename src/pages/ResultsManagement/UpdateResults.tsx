import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Paper } from "@mui/material";
import { IconBrandTinder } from "@tabler/icons-react";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import { Delete, Print, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { StudentDetailsType } from "types/student";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import firebase from "../../firebase";
import { MarksheetReportGenerator } from "components/Reports/MarksheetReport";
import { paperMarksType, resultType } from "types/results";

type examType = {
  examId: string;
  examTitle: string;
};

type paperType = {
  paperId: string;
  paperTitle: string;
};

type examConfig = {
  examPapers: paperType[];
  exams: examType[];
};

function UpdateResults() {
  const [updateResultDialogOpen, setUpdateResultDialogOpen] =
    useState<boolean>(false);
  const [examsList, setExamList] = useState<examType[]>([]);
  const [paperList, setPaperList] = useState<paperType[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<StudentDetailsType[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [selectedRoll, setSelectedRoll] = useState<any | null>(null);
  const [rollNoList, setRollNoList] = useState<string[] | null>(null);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState<boolean>(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState<boolean>(false);
  const [isUpdatingResult, setIsUpdatingResult] = useState(false);
  const [currentSelectedStudent, setCurrentSelectedStudent] =
    useState<StudentDetailsType | null>(null);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [studentSelectedMarkList, setStudentSelectedMarkList] = useState<
    paperMarksType[]
  >([]);
  const [studentPublishedResults, setStudentPublishedResults] = useState<
    resultType[] | null
  >(null);
  const [fetchingStudentPublishedResult, setFetchingStudentPublishedResult] =
    useState<boolean>(false);

  const [studentIdInput, setStudentIdInput] = useState<string | null>(null);
  const [resultDocId, setResultDocId] = useState<string | null>(null);
  const [isDeleteConfimDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState<boolean>(false);

  const [selectedExamDocId, setSelectedExamDocId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setStudentList([]);
    db.collection("CONFIG")
      .doc("EXAM_CONFIG")
      .get()
      .then((snap) => {
        const data = snap.data() as examConfig;
        if (data) {
          console.log(data);
          setPaperList(data.examPapers);
          setExamList(data.exams);
        } else {
          console.log("No data retrieved from exam config..");
        }
      })
      .catch((err) => {
        console.log("Error while fetching exams / papers", err);
      });
  }, []);

  useEffect(() => {
    if (currentSelectedStudent) {
      setStudentPublishedResults([]);
      setFetchingStudentPublishedResult(true);
      const subscribe = db
        .collection("STUDENTS")
        .doc(currentSelectedStudent.id)
        .collection("PUBLISHED_RESULTS")
        .onSnapshot((results) => {
          if (results.size > 0) {
            let resultListTemp: resultType[] = [];
            results.forEach((result) => {
              const resultData = result.data() as resultType;
              resultData["docId"] = result.id;
              resultListTemp.push(resultData);
            });
            setStudentPublishedResults(resultListTemp);
            setFetchingStudentPublishedResult(false);
          } else {
            setFetchingStudentPublishedResult(false);
          }
        });
      return subscribe;
    }
  }, [currentSelectedStudent]);

  useEffect(() => {
    if (selectedClass) {
      db.collection("STUDENTS")
        .where("class", "==", selectedClass)
        .orderBy("class_roll", "asc")
        .get()
        .then((snapshot) => {
          let rollListTemp: string[] = [];
          let studentListTemp: StudentDetailsType[] = [];
          if (snapshot.size > 0) {
            snapshot.forEach((student) => {
              const studData = student.data() as StudentDetailsType;
              rollListTemp.push(studData.class_roll);
              studentListTemp.push(studData);
            });
            setStudentList(studentListTemp);
            setRollNoList(rollListTemp);
          } else {
            console.log(`No Student Found For Class ${selectedClass}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedClass]);

  const handleStudentSearch = () => {
    if (studentIdInput) {
      db.collection("STUDENTS")
        .where("admission_no", "==", studentIdInput)
        .get()
        .then((snap) => {
          if (snap.size > 0) {
            let studentTemp: StudentDetailsType[] = [];
            snap.forEach((student) => {
              studentTemp.push(student.data() as StudentDetailsType);
            });
            setCurrentSelectedStudent(studentTemp[0]);
          } else {
            enqueueSnackbar(`No Student Found With Id ${studentIdInput}`, {
              variant: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(`No Student Found With Id ${studentIdInput}`, {
            variant: "error",
          });
        });
    }

    if (selectedRoll) {
      const currentStudent = studentList
        .filter((student) => student.class_roll === selectedRoll)
        .at(0);
      setCurrentSelectedStudent(currentStudent!);
    }
  };

  const handleNextStudentBtn = () => {
    if (currentSelectedStudent) {
      const currentIndex = studentList.indexOf(currentSelectedStudent);
      if (currentIndex !== 0) {
        setPrevBtnDisabled(false);
        setNextBtnDisabled(false);
      }
      const updatedStudent = studentList[currentIndex + 1];
      setCurrentSelectedStudent(updatedStudent);
    }
  };

  const handlePrevStudentBtn = () => {
    if (currentSelectedStudent) {
      const currentIndex = studentList.indexOf(currentSelectedStudent);
      if (currentIndex == 0) {
        setPrevBtnDisabled(true);
        setNextBtnDisabled(false);
        return;
      }
      const updatedStudent = studentList[currentIndex - 1];
      setCurrentSelectedStudent(updatedStudent);
    }
  };

  const handleAddPaperBtn = () => {
    console.log(selectedPapers);

    selectedPapers.map((selectedPaper) => {
      const paper = paperList
        .filter((paper) => paper.paperId === selectedPaper)
        .at(0);
      if (paper) {
        const paperWithMarks: paperMarksType = {
          paperId: paper.paperId,
          paperTitle: paper.paperTitle,
          paperMarkObtained: 0,
          paperMarkTheory: 80,
          paperMarkPassing: 33,
          paperMarkPractical: 20,
        };

        const isPaperAlreadyExising = studentSelectedMarkList.filter(
          (item) => item.paperId === paperWithMarks.paperId
        );
        if (isPaperAlreadyExising.length > 0) {
          return;
        } else {
          setStudentSelectedMarkList((prev) => [...prev, paperWithMarks]);
        }
      }
    })
  };

  const handlePaperDeleteBtn = (paper: paperMarksType) => {
    setStudentSelectedMarkList(
      studentSelectedMarkList.filter((item) => item.paperId != paper.paperId)
    );
  };

  const handleMarkUpdate = (
    val: string,
    paper: paperMarksType,
    type: string
  ) => {
    if (type === "THEORY") {
      setStudentSelectedMarkList((prev) =>
        prev.map((item) =>
          item.paperId === paper.paperId
            ? { ...item, paperMarkTheory: Number(val) }
            : item
        )
      );
    } else if (type === "PRAC") {
      setStudentSelectedMarkList((prev) =>
        prev.map((item) =>
          item.paperId === paper.paperId
            ? { ...item, paperMarkPractical: Number(val) }
            : item
        )
      );
    } else {
      setStudentSelectedMarkList((prev) =>
        prev.map((item) =>
          item.paperId === paper.paperId
            ? { ...item, paperMarkObtained: Number(val) }
            : item
        )
      );
    }
  };

  const handleSaveResultBtn = () => {
    if (currentSelectedStudent != null) {
      if (selectedExam != null) {
        if (studentSelectedMarkList.length > 0) {
          //create result data

          const examTitle = examsList
            .filter((exam) => exam.examId === selectedExam)
            .at(0)?.examTitle!;

          const resultData: resultType = {
            examId: selectedExam,
            examTitle: examTitle,
            publishedOn: firebase.firestore.Timestamp.now(),
            result: studentSelectedMarkList,
          };
          ///update student marks
          if (isUpdatingResult) {
            if (resultDocId) {
              db.collection("STUDENTS")
                .doc(currentSelectedStudent.id)
                .collection("PUBLISHED_RESULTS")
                .doc(resultDocId)
                .update(resultData)
                .then(() => {
                  setUpdateResultDialogOpen(false);
                  enqueueSnackbar("Result published successfully!", {
                    variant: "success",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  enqueueSnackbar("Failed to save result!", {
                    variant: "error",
                  });
                });
            } else {
              enqueueSnackbar("Result document doesn't exit!");
            }
          } else {
            db.collection("STUDENTS")
              .doc(currentSelectedStudent.id)
              .collection("PUBLISHED_RESULTS")
              .doc()
              .set(resultData)
              .then(() => {
                setUpdateResultDialogOpen(false);
                enqueueSnackbar("Result published successfully!", {
                  variant: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                enqueueSnackbar("Failed to save result!", { variant: "error" });
              });
          }
        } else {
          enqueueSnackbar("No paper selected !", {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar("No exam selected !", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Unable to get current student data!", {
        variant: "error",
      });
    }
  };

  const handleResultDeleteBtn = (id: string) => {
    setSelectedExamDocId(id);
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleDeletePaperAfterConfirmation = () => {
    if (currentSelectedStudent && selectedExamDocId) {
      db.collection("STUDENTS")
        .doc(currentSelectedStudent?.id)
        .collection("PUBLISHED_RESULTS")
        .doc(selectedExamDocId)
        .delete()
        .then(() => {
          setIsDeleteConfirmDialogOpen(false);
          enqueueSnackbar("Plublished result deleted successfully!", {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar("Error while deleting result!", { variant: "error" });
          console.log(err);
        });
    }
  };

  const handleInputResetBtn = () => {
    setStudentIdInput(null);
    setSelectedClass(null);
    setSelectedRoll(null);
    setStudentList([]);
    setStudentSelectedMarkList([]);
  };

  const handleEditPublishedResult = (result: resultType) => {
    setSelectedExam(result.examId);
    setStudentSelectedMarkList(result.result);
    setResultDocId(result.docId!);
    setIsUpdatingResult(true);
    setUpdateResultDialogOpen(true);
  };

  useEffect(() => {
    if (!updateResultDialogOpen) {
      setIsUpdatingResult(false);
      setStudentSelectedMarkList([]);
      setSelectedExam(null);
    }
  }, [updateResultDialogOpen]);

  const printStudentMarksheet = async (result: resultType) => {
    const pdfUrl = await MarksheetReportGenerator([
      { student: currentSelectedStudent!, result: result.result, examTitle: result.examTitle },
    ]);
    const createPDFWindow =
      "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    window.open(pdfUrl, "_blank", createPDFWindow);
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={IconBrandTinder}
          Path="School Results/Update Results"
        />
        <Paper sx={{ p: "10px", mt: "8px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography level="title-md">Search Student</Typography>
            </Box>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Input
                placeholder="Search by student id.."
                value={studentIdInput!}
                onChange={(e) => setStudentIdInput(e.target.value)}
              ></Input>
              <Typography>Or</Typography>
              <Select
                placeholder="choose class"
                onChange={(e, val) => setSelectedClass(val)}
              >
                {SCHOOL_CLASSES.map((item) => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
              <Select
                placeholder="choose roll"
                onChange={(e, val) => setSelectedRoll(val)}
              >
                {rollNoList &&
                  rollNoList.map((item, key) => {
                    return <Option value={item}>{item}</Option>;
                  })}
              </Select>
              <Button
                sx={{ ml: "8px" }}
                startDecorator={<Search />}
                onClick={handleStudentSearch}
              ></Button>
              <Button
                variant="soft"
                sx={{ ml: "8px" }}
                onClick={handleInputResetBtn}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
          {currentSelectedStudent ? (
            <Box>
              <Divider sx={{ mt: "12px", mb: "8px" }} />
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button
                    startDecorator={<NavigateBeforeIcon />}
                    variant="plain"
                    onClick={handlePrevStudentBtn}
                    disabled={prevBtnDisabled}
                  >
                    Back
                  </Button>
                  <Box>
                    <Chip size="lg" color="primary">
                      {currentSelectedStudent
                        ? `Name- ${currentSelectedStudent.student_name}, Id- ${currentSelectedStudent.admission_no}, Roll No- ${currentSelectedStudent.class_roll}`
                        : "No Student Found"}
                    </Chip>
                  </Box>
                  <Button
                    endDecorator={<NavigateNextIcon />}
                    variant="plain"
                    onClick={handleNextStudentBtn}
                    disabled={nextBtnDisabled}
                  >
                    Next
                  </Button>
                </Stack>
              </Box>
              <Divider sx={{ mt: "12px", mb: "8px" }} />
              <Box padding="10px">
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  {fetchingStudentPublishedResult ? (
                    <Grid
                      xs={12}
                      alignItems={"center"}
                      justifyContent={"center"}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <CircularProgress />
                      <Typography>Fetching...</Typography>
                    </Grid>
                  ) : null}
                  {studentPublishedResults &&
                    studentPublishedResults.map((result) => {
                      return (
                        <Grid>
                          <Sheet
                            variant="soft"
                            color="success"
                            sx={{
                              borderRadius: "8px",
                              border: "1px solid var(--bs-gray)",
                            }}
                          >
                            <Stack
                              direction="row"
                              height="90px"
                              alignItems="center"
                              sx={{ m: "10px" }}
                              justifyContent="space-between"
                            >
                              <Stack
                                direction={"column"}
                                flex={1}
                                height="100%"
                              >
                                <Box
                                  flex={1}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <Typography
                                    level="title-lg"
                                    sx={{ ml: "1.2rem", mr: "1.2rem" }}
                                  >
                                    {result.examTitle}
                                  </Typography>
                                </Box>
                                <Divider />
                                <Typography level="body-sm" textAlign="center">
                                  Published:
                                  {result.publishedOn
                                    .toDate()
                                    .toLocaleDateString()}
                                </Typography>
                              </Stack>

                              <Divider
                                orientation="vertical"
                                sx={{ ml: "8px", mr: "8px" }}
                              />
                              <Stack direction={"column"}>
                                <Button
                                  variant="plain"
                                  color="primary"
                                  size="sm"
                                  onClick={() =>
                                    handleEditPublishedResult(result)
                                  }
                                  startDecorator={<EditIcon />}
                                ></Button>
                                <Button
                                  variant="plain"
                                  color="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleResultDeleteBtn(result.docId!)
                                  }
                                  startDecorator={<Delete />}
                                ></Button>
                                <Button
                                  variant="plain"
                                  color="success"
                                  size="sm"
                                  onClick={() => printStudentMarksheet(result)}
                                  startDecorator={<Print />}
                                ></Button>
                              </Stack>
                            </Stack>
                          </Sheet>
                        </Grid>
                      );
                    })}

                  <Grid>
                    <Button
                      variant="outlined"
                      color="neutral"
                      onClick={() => setUpdateResultDialogOpen(true)}
                      sx={{ height: "110px", width: "90px" }}
                      startDecorator={<AddIcon />}
                    ></Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : null}
        </Paper>
        <Modal
          open={updateResultDialogOpen}
          onClose={() => setUpdateResultDialogOpen(false)}
        >
          <ModalDialog
            variant="outlined"
            role="alertdialog"
            sx={{ minWidth: "580px", minHeight: "90%" }}
          >
            <DialogTitle>
              <UpdateIcon />
              Update Exam Result
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ display: "flex" }}>
              <Sheet variant="outlined">
                <Stack direction="row" p="10px" alignItems="center" gap={2}>
                  <Typography>Select Examination</Typography>
                  <Select
                    placeholder="select exam..."
                    sx={{ flex: 1 }}
                    value={selectedExam}
                    onChange={(e, val) => setSelectedExam(val)}
                  >
                    {examsList.map((item) => {
                      return (
                        <Option key={item.examId} value={item.examId}>
                          {item.examTitle}
                        </Option>
                      );
                    })}
                  </Select>
                </Stack>
              </Sheet>
              <Sheet variant="outlined">
                <Stack
                  direction="row"
                  p="10px"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Add Paper</Typography>
                  <Stack direction={"row"} gap={2}>
                    <Select
                      multiple
                      placeholder="select paper..."
                      onChange={(e, val) => {
                        setSelectedPapers(val as string[])
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                          {selected.map((selectedOption) => (
                            <Chip variant="soft" color="primary">
                              {selectedOption.label}
                            </Chip>
                          ))}
                        </Box>
                      )}
                    >
                      {paperList.map((item) => {
                        return (
                          <Option key={item.paperId} value={item.paperId}>
                            {item.paperTitle}
                          </Option>
                        );
                      })}
                    </Select>
                    <Button
                      startDecorator={<ArrowDownwardIcon />}
                      size="sm"
                      onClick={handleAddPaperBtn}
                    ></Button>
                  </Stack>
                </Stack>
              </Sheet>
              <Divider sx={{ mt: "8px", mb: "8px" }} />
              <Typography level="title-sm">
                Please fill marks for respective papers.
              </Typography>

              <Typography textAlign="center">Total Theory | Total Practical | Marks Obtained</Typography>
              <Sheet
                sx={{ mt: "6px", flex: 1, p: "10px" }}
                variant="soft"
                color="neutral"
              >
                {studentSelectedMarkList.length == 0 ? (
                  <Typography>No Paper Selected</Typography>
                ) : null}
                {studentSelectedMarkList.map((paper, index) => {
                  return (
                    <Stack
                      key={paper.paperId}
                      direction="row"
                      alignItems="center"
                      mb={"1rem"}
                      justifyContent="space-between"
                    >
                      <Typography level="title-md" sx={{ mr: "8px" }}>
                        {index + 1}. {paper.paperTitle}
                      </Typography>
                      <Stack direction={"row"} gap={2}>
                        <Input
                          type="text"
                          sx={{ width: "90px" }}
                          onChange={(e) =>
                            handleMarkUpdate(e.target.value, paper, "THEORY")
                          }
                          value={paper.paperMarkTheory || 0}
                        />
                        <Input
                          type="text"
                          sx={{ width: "90px" }}
                          onChange={(e) =>
                            handleMarkUpdate(e.target.value, paper, "PRAC")
                          }
                          value={paper.paperMarkPractical || 0}
                        />
                        <Divider orientation="vertical" />
                        <Input
                          type="text"
                          sx={{ width: "90px" }}
                          onChange={(e) =>
                            handleMarkUpdate(e.target.value, paper, "OBTAINED")
                          }
                          value={paper.paperMarkObtained || 0}
                        />
                        <Button
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handlePaperDeleteBtn(paper)}
                          startDecorator={<Delete />}
                        ></Button>
                      </Stack>
                    </Stack>
                  );
                })}
              </Sheet>
            </DialogContent>
            <DialogActions>
              <Button
                variant="solid"
                color="success"
                onClick={handleSaveResultBtn}
              >
                {isUpdatingResult ? "Update Result" : "Save Result"}
              </Button>

              <Button
                variant="plain"
                color="neutral"
                onClick={() => setUpdateResultDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
        <Modal
          open={isDeleteConfimDialogOpen}
          onClose={() => setIsDeleteConfirmDialogOpen(false)}
        >
          <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>
              <WarningRoundedIcon />
              Confirmation
            </DialogTitle>
            <Divider />
            <DialogContent>
              Are you sure you want to delete exam result?
            </DialogContent>
            <DialogActions>
              <Button
                variant="solid"
                color="danger"
                onClick={handleDeletePaperAfterConfirmation}
              >
                Delete Result
              </Button>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setIsDeleteConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
      </LSPage>
    </PageContainer>
  );
}

export default UpdateResults;
