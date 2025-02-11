import PageContainer from "../../components/Utils/PageContainer";
import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import {
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  ListItemIcon,
  Menu,
  Typography,
} from "@mui/material";

import Styles from "./ViewStudents.module.scss";
import { Link, useNavigate } from "react-router-dom";
import GrainIcon from "@mui/icons-material/Grain";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { useState } from "react";
import MaterialTable from "@material-table/core";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { MoreVert } from "@mui/icons-material";

import { useSnackbar } from "notistack";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";

import StudentProfileDetailsModal from "components/Modals/StudentProfileDetailsModal";
import { getClassNameByValue } from "utilities/UtilitiesFunctions";
import { StudReportPDF } from "components/StudentDetailsReport/StudentReportGeneratorPDF";
import ExportToExcel from "components/Reports/ExportToExcel";
import { Avatar } from "@mui/joy";
import { deleltedata, fetchstudent } from "store/reducers/studentSlice";

function ViewStudents() {
  const data = useSelector((state) => state.students.studentarray);
  const isDataLoading = useSelector((state) => state.students.loading);
  const error = useSelector((state) => state.students.error);

  const { enqueueSnackbar } = useSnackbar();

  const dipatch = useDispatch();

  const [filteredData, setFilteredData] = useState(Array.from(data));
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filterChip, setFilterChip] = useState(false);
  const [filterChipLabel, setFilterChipLabel] = useState();

  //topbar selection state
  const [session, setSession] = useState("2023/24");
  const [selectedClass, setSelectedClass] = useState(-1);
  const [selectedSection, setSelectedSection] = useState(-1);

  //student Profile
  const [studentProfileDetailsModalOpen, setStudentProfileModalOpen] =
    useState(false);

  //confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedStudentUID, setSelectedStudentUID] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  //payment
  // const [feeDetail, setFeeDetails] = useState([]);
  // const [loading, setLoading] = useState(false);
  ///menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowData(rowData);
    setSelectedId(rowData.id);
    console.log(rowData.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (Array.from(data).length === 0) {
      dipatch(fetchstudent());
    }
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar("ERROR:" + error, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  useEffect(() => {
    if (!isDataLoading) {
      setFilteredData(data);
    }
  }, [isDataLoading, data]);

  const handleFilterButton = () => {
    if (selectedClass !== -1 && selectedSection !== -1) {
      let dataNew = data.filter((data) => {
        return data.class === selectedClass && data.section === selectedSection;
      });
      setFilteredData(dataNew);
      setFilterChipLabel(
        "Filter set for class " +
          getClassNameByValue(selectedClass) +
          " and section " +
          selectedSection
      );
      setFilterChip(true);
    } else if (selectedSection === -1 && selectedClass !== -1) {
      let dataNew = data.filter((data) => {
        return data.class === selectedClass;
      });
      setFilteredData(dataNew);
      setFilterChipLabel(
        "Filter set for class " + getClassNameByValue(selectedClass)
      );
      setFilterChip(true);
    }
  };

  const deletestudent = (data) => {
    setDeleteLoading(false);
    setConfirmationModal(true);
    setSelectedStudentUID(data.id);
  };

  const handleStudentDelete = () => {
    setDeleteLoading(true);
    dipatch(deleltedata(selectedStudentUID))
      .unwrap()
      .then((data) => {
        console.log("delete student", data);
        setConfirmationModal(false);
        enqueueSnackbar("Student deleted successfully !", {
          variant: "success",
        });
        setDeleteLoading(false);
      });
  };

  const navigate = useNavigate();
  const updatestudent = (student) => {
    navigate(`/students/update-student/${student.id}`);
  };

  const handleNewWindowOpen = async () => {
    const pdfRes = await StudReportPDF(filteredData);
    const features =
      "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    window.open(pdfRes, "_blank", features);
  };

  //column for material table
  const columnMat = [
    {
      field: "student_id",
      title: "ID",
      render: (rowData) => {
        return (
          <Link
            to={`/students/profile/${rowData.id}`}
            style={{
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: "500",
              color: "var(--bs-primary-text)",
            }}
          >
            {rowData.admission_no}
          </Link>
        );
      },
    },
    {
      title: "Profile",
      field: "profil_url",

      export: false,
      render: (rowData) => {
        const styles = {
          width: 40,
          height: 40,
          borderRadius: "50%",
          cursor: "pointer",
          objectFit: "cover",
        };
        return <Avatar src={rowData.profil_url} alt="profile-student" />;
      },
    },

    { field: "student_name", title: "Name" },
    {
      field: "class",
      title: "Class",
      render: (rowData) => {
        return <p>{getClassNameByValue(rowData.class)}</p>;
      },
    },
    { field: "section", title: "Section" },
    { field: "class_roll", title: "Roll" },
    { field: "father_name", title: "Father Name" },
    { field: "contact_number", title: " Contact number" },
  ];
  const handleDelete = () => {
    setFilterChip(!filterChip);
    if (filterChip) {
      setSelectedClass(-1);
      setSelectedSection(-1);
      setFilteredData(data);
    }
  };

  // if (loading === true) return <h1>loading</h1>;/
  return (
    <PageContainer className={Styles.page}>
      <Navbar />
      <LSPage>
        <ConfirmationModal
          open={confirmationModal}
          setModalOpen={setConfirmationModal}
          handleStudentDelete={handleStudentDelete}
          deleteLoading={deleteLoading}
        />
        <Paper
          sx={{ padding: "5px 10px", width: "100%" }}
          className={Styles.viewStudentHeader}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <a
              style={{
                textDecoration: "none",
                color: "#343a40",
                display: "flex",
                alignItems: "center",
              }}
              href="/"
            >
              <PersonIcon sx={{ mr: 0.3 }} fontSize="inherit" />
              Students
            </a>

            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="text.secondary"
            >
              <GrainIcon sx={{ mr: 0.3 }} fontSize="inherit" />
              View Students
            </Typography>
          </Breadcrumbs>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl
              variant="standard"
              sx={{ mr: 2, padding: 0, minWidth: 150, background: "#fff" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Select session
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="session"
                value={session}
              >
                <MenuItem value={1}>
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="2023/24">2023/24</MenuItem>
                <MenuItem value="2025/26">2025/26</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ mr: 2, padding: 0, minWidth: 150, background: "#fff" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Select class
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="select class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <MenuItem value={-1}>
                  <em>Select</em>
                </MenuItem>
                <MenuItem value={14}>Pre-Nursery</MenuItem>
                <MenuItem value={1}>Nursery</MenuItem>
                <MenuItem value={2}>LKG</MenuItem>
                <MenuItem value={3}>UKG</MenuItem>
                <MenuItem value={4}>STD-1</MenuItem>
                <MenuItem value={5}>STD-2</MenuItem>
                <MenuItem value={6}>STD-3</MenuItem>
                <MenuItem value={7}>STD-4</MenuItem>
                <MenuItem value={8}>STD-5</MenuItem>
                <MenuItem value={9}>STD-6</MenuItem>
                <MenuItem value={10}>STD-7</MenuItem>
                <MenuItem value={11}>STD-8</MenuItem>
                <MenuItem value={12}>STD-9</MenuItem>
                <MenuItem value={13}>STD-10</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 0, minWidth: 150 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Select section
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Class"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <MenuItem value={-1}>
                  <em>Select</em>
                </MenuItem>
                <MenuItem value={"A"}>SEC-A</MenuItem>
                <MenuItem value={"B"}>SEC-B</MenuItem>
                <MenuItem value={"C"}>SEC-C</MenuItem>
                <MenuItem value={"D"}>SEC-D</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              sx={{ ml: 2, mr: 2, background: "var(--bs-gray-300)" }}
              onClick={handleFilterButton}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Paper>
        <br />
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "end",
            alignContent: "end",
          }}
        >
          {filterChip ? (
            <Chip
              label={filterChipLabel}
              variant="filled"
              // onClick={handleClick}
              onDelete={handleDelete}
            />
          ) : null}
        </div>
        <Box sx={{ width: "100%" }}>
          {/* <LinearProgress /> */}
          {isDataLoading ? <LinearProgress /> : null}
        </Box>
        <br></br>
        <MaterialTable
          style={{ display: "grid" }}
          columns={columnMat}
          data={filteredData}
          title="Students Data"
          options={{
            grouping: true,
            headerStyle: {
              backgroundColor: "#5d87ff",
              color: "#FFF",
            },
            exportMenu: [
              {
                label: "Export PDF",
                // exportFunc: (cols, datas) =>
                //   ExportPdf(cols, datas, "myPdfFileName"),
                exportFunc: () => handleNewWindowOpen(),
              },
              {
                label: "Export Excel",
                exportFunc: () => ExportToExcel(filteredData),
              },
            ],
            actionsColumnIndex: -1,
          }}
          actions={[
            {
              icon: () => <EditIcon sx={{ color: "var(--bs-primary)" }} />,
              tooltip: "Edit Row",
              onClick: (event, rowData) => {
                updatestudent(rowData);
              },
            },

            {
              icon: () => (
                <DeleteForeverIcon sx={{ color: "var(--bs-danger2)" }} />
              ),
              tooltip: "Delete Student",
              onClick: (event, rowData) => {
                deletestudent(rowData);
              },
            },
            {
              icon: () => (
                <MoreVert
                  aria-controls={menuOpen ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? "true" : undefined}
                />
              ),
              tooltip: "More options",
              onClick: (event, rowData) => {
                console.log("Row Data: ", rowData);
                handleMenuClick(event, rowData);
              },
            },
          ]}
        />
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => setStudentProfileModalOpen(true)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            View Quick Profile
          </MenuItem>
          <Divider />
          {/* <MenuItem onClick={handleMenuClick}>
            <ListItemIcon>
              <BadgeIcon fontSize="small" />
            </ListItemIcon>
            Generate ID Card
          </MenuItem> */}
          <MenuItem onClick={handleMenuClick}>
            <ListItemIcon>
              <BlockIcon fontSize="small" />
            </ListItemIcon>
            Suspend User
          </MenuItem>
        </Menu>
        {selectedRowData && studentProfileDetailsModalOpen ? (
          <StudentProfileDetailsModal
            selectedRowData={selectedRowData}
            handleStudentProfileModalClose={() => {
              setStudentProfileModalOpen(false);
              setSelectedRowData(null);
            }}
          />
        ) : null}
      </LSPage>
    </PageContainer>
  );
}
export default ViewStudents;
