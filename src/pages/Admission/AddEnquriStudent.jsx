import React, { useEffect, useRef, useState } from "react";
import PageContainer from "../../components/Utils/PageContainer";
import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Styles from "../Users/AddStudent.module.scss";
import { IconEdit, IconPrinter } from "@tabler/icons-react";
import ReactToPrint from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GrainIcon from "@mui/icons-material/Grain";
import { useSnackbar } from "notistack";
import { db } from "../../firebase";
import { FormHelperText, FormLabel, Switch } from "@mui/joy";
import { color } from "framer-motion";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { addstudent } from "store/reducers/studentSlice";

function AddEnquire() {
  const printRef = useRef();
  const dispatch = useDispatch();
  const { id } = useParams();


  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [monthlyFee, setMonthlyFee] = useState(null);
  const [computerFee, setComputerFee] = useState(0);
  const [transportationFee, setTransportationFee] = useState(0);
  const [admissionFee, setAdmissionFee] = useState(0);
  const [defaultFee, setDefaultFee] = useState(null);
  const [isMonthlyFeeEditable, setIsMonthlyFeeEditable] = useState(true);
  const [isComputerFeeEditable, setIsComputerFeeEditable] = useState(true);
  const [isAdmissionFeeEditable, setIsAdmissionFeeEditable] = useState(true);
  const [isTransportationFeeEditable, setIsTransportationFeeEditable] =
    useState(true);
  const formRef = useRef();
  const users = useSelector((state) => state.students.studentarray);

  const [equireData, setEquireData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  useEffect(() => {
    db.collection("ADMISSION_ENQUIRY")
      .doc(id)
      .get()
      .then((data) => {
        setEquireData(data.data());
        console.log(data.data());
      });
  },[]);

  const [formData, setFormData] = useState({
    student_name: "",
    class_roll: "",
    admission_no: "",
    dob: "",
    date_of_addmission: "",
    gender: "",
    blood_group: "",
    id: "",
    class: "",
    section: "",
    email: "",
    cast: "",
    aadhar_number: "",
    religion: "",
    father_name: "",
    profil_url: "",
    father_occupation: "",
    father_qualification: "",
    mother_name: "",
    motherqualifiation: "",
    mother_occupation: "",
    city: "",
    state: "",
    postal_code: "",
    address: "",
    contact_number: "",
    alternate_number: "",
    created_at: "",
    updated_at: "",
    monthly_fee: "",
    computer_fee: "",
    transportation_fee: "",
    admission_fee: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(selectedImage);

    if (monthlyFee) {
      if (admissionFee) {
        formData["monthly_fee"] = monthlyFee;
        formData["computer_fee"] = computerFee;
        formData["transportation_fee"] = monthlyFee;
        formData["admission_fee"] = monthlyFee;

        setLoading(true);
        dispatch(
          addstudent({ studentData: formData, studentProfile: selectedImage })
        )
          .unwrap()
          .then((d) => {
            enqueueSnackbar("Successfully Registered", { variant: "success" });
            setLoading(false);
            setSelectedImage(null);
            formRef.current.reset();
          })
          .catch((e) => {
            console.log({ "dispatch error": e });
            enqueueSnackbar(e, { variant: "error" });
            setLoading(false);
          });
      } else {
        enqueueSnackbar("Please enter admission fee!");
      }
    } else {
      enqueueSnackbar("Please enter monthly fee!");
    }
  };

  useEffect(() => {
    db.collection("DEFAULT_FEE")
      .doc("default_tution_fee")
      .get()
      .then((snap) => {
        if (snap.exists) {
          console.log(snap.data());
          setDefaultFee(snap.data());
        } else {
          enqueueSnackbar(
            "Default fee cannot be determined! Please set default fee first.",
            { variant: "warning" }
          );
        }
      });
  }, []);

  useEffect(() => {
    if (formData.class && defaultFee) {
      switch (formData.class) {
        case 1:
          setMonthlyFee(defaultFee.default_fee_class_1);
          break;
        case 2:
          setMonthlyFee(defaultFee.default_fee_class_2);
          break;
        case 3:
          setMonthlyFee(defaultFee.default_fee_class_3);
          break;
        case 4:
          setMonthlyFee(defaultFee.default_fee_class_4);
          break;
        case 5:
          setMonthlyFee(defaultFee.default_fee_class_5);
          break;
        case 6:
          setMonthlyFee(defaultFee.default_fee_class_6);
          break;
        case 7:
          setMonthlyFee(defaultFee.default_fee_class_7);
          break;
        case 8:
          setMonthlyFee(defaultFee.default_fee_class_8);
          break;
        case 9:
          setMonthlyFee(defaultFee.default_fee_class_9);
          break;
        case 10:
          setMonthlyFee(defaultFee.default_fee_class_10);
          break;
        case 11:
          setMonthlyFee(defaultFee.default_fee_class_11);
          break;
        case 12:
          setMonthlyFee(defaultFee.default_fee_class_12);
          break;
        case 13:
          setMonthlyFee(defaultFee.default_fee_class_13);
          break;
        default:
          setMonthlyFee(0);
          break;
      }
    } else {
      enqueueSnackbar("Default fee failed to load!");
    }
  }, [formData.class]);

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <div
          style={{
            backgroundColor: "var(--bs-gray-201)",
            padding: "10px",
            borderRadius: "5px",
            margin: "0px 8px",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#343a40",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PersonAddIcon sx={{ mr: 0.3 }} fontSize="inherit" />
              Faculty
            </Link>

            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="text.secondary"
            >
              <GrainIcon sx={{ mr: 0.3 }} fontSize="inherit" />
              All Faculties
            </Typography>
          </Breadcrumbs>
        </div>
        <br />
        <Paper
          sx={{ padding: "10px 30px", margin: "0px 10px " }}
          className={Styles.paper}
        >
          <div className={Styles.pageHeader}>
            <h3>Add Student Form</h3>
            <ReactToPrint
              content={() => printRef.current}
              copyStyles={true}
              trigger={() => <IconPrinter size={45} />}
            />
          </div>

          <form onSubmit={handleSubmit} ref={formRef}>
            <span className={Styles.inputSeperator}>Personal Details</span>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%", height: "30px" }}
                  label="Name"
                  value={equireData.student_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      student_name: e.target.value,
                    }))
                  }
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" required>
                    Class
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Class"
                    value={equireData.class}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        class: e.target.value,
                      }))
                    }
                    required
                  >
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
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" required>
                    Section
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="SECTION"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        section: e.target.value,
                      }))
                    }
                    required
                  >
                    <MenuItem value={"A"}>SEC-A</MenuItem>
                    <MenuItem value={"B"}>SEC-B</MenuItem>
                    <MenuItem value={"C"}>SEC-C</MenuItem>
                    <MenuItem value={"D"}>SEC-D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Class Roll No"
                  type="number"
                  variant="outlined"
                  value={formData.classRoll}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      class_roll: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="DOB"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dob: e.target.value,
                    }))
                  }
                  type="date"
                  required
                />
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Admission Number"
                  variant="outlined"
                  inputProps={{ minLength: 6 }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admission_no: e.target.value,
                    }))
                  }
                  type="number"
                  required
                />
              </Grid> */}
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Admission Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date_of_addmission: e.target.value,
                    }))
                  }
                  type="date"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" required>
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Gender"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    required
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Blood Group"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      blood_group: e.target.value,
                    }))
                  }
                  type="text"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Religion"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      religion: e.target.value,
                    }))
                  }
                  type="text"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Cast"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cast: e.target.value,
                    }))
                  }
                  variant="outlined"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Aaadhar Number"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aadhar_number: e.target.value,
                    }))
                  }
                  variant="outlined"
                  type="number"
                />
              </Grid>
            </Grid>
            {/* Family Details */}
            <br />
            <br />
            <span className={Styles.inputSeperator}>Family Details</span>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Father's Name"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      father_name: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Occupation"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      father_occupation: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Qualification"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      father_qualification: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Mother's Name"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mother_name: e.target.value,
                    }))
                  }
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Occupation"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mother_occupation: e.target.value,
                    }))
                  }
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Qualification"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      motherqualifiation: e.target.value,
                    }))
                  }
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Correspondance */}
            <br />
            <br />
            <span className={Styles.inputSeperator}>Contact Details</span>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Contact Number"
                  variant="outlined"
                  type="number"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact_number: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Contact Alternate"
                  type="number"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alternate_number: e.target.value,
                    }))
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Email"
                  type="email"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Address Full"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="city"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="state"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Postal Code"
                  type="number"
                  variant="outlined"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      postal_code: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
            </Grid>
            <span className={Styles.inputSeperator}>Fee Details</span>
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Grid item xs={12} md={4}>
                <div>
                  <FormLabel>Monthly/Computer/Transportation Fee</FormLabel>
                  <FormHelperText sx={{ mt: 0 }}>
                    Adjust fee or use default.
                  </FormHelperText>
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Monthly Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    size="small"
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    disabled={isMonthlyFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={monthlyFee}
                    label="Monthly Fee"
                    required
                  />
                </FormControl>
                <IconEdit
                  stroke={2}
                  className={Styles.editBtn}
                  onClick={() => setIsMonthlyFeeEditable(!isMonthlyFeeEditable)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Computer Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    size="small"
                    onChange={(e) => setComputerFee(e.target.value)}
                    disabled={isComputerFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={computerFee}
                    label="Computer Fee"
                    required
                  />
                </FormControl>
                <IconEdit
                  stroke={2}
                  className={Styles.editBtn}
                  onClick={() =>
                    setIsComputerFeeEditable(!isComputerFeeEditable)
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Transportation Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    size="small"
                    onChange={(e) => setTransportationFee(e.target.value)}
                    disabled={isTransportationFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={transportationFee}
                    label="Transportation Fee"
                    required
                  />
                </FormControl>
                <IconEdit
                  stroke={2}
                  className={Styles.editBtn}
                  onClick={() =>
                    setIsTransportationFeeEditable(!isTransportationFeeEditable)
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }} required>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Admission Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    size="small"
                    onChange={(e) => setAdmissionFee(e.target.value)}
                    disabled={isAdmissionFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={admissionFee}
                    label="Admission Fee"
                    required
                  />
                </FormControl>
                <IconEdit
                  stroke={2}
                  className={Styles.editBtn}
                  onClick={() =>
                    setIsAdmissionFeeEditable(!isAdmissionFeeEditable)
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Typography
                variant="h6"
                marginLeft="1rem"
                width="100%"
                gutterBottom
                sx={{ mt: 5 }}
              >
                Select Student Photo
              </Typography>

              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/png ,image/jpeg"
                  style={{ display: "none" }}
                  id="imageInput"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginLeft: "1rem",
                    }}
                  />
                )}
              </div>
              <label htmlFor="imageInput">
                <Button
                  component="span"
                  variant="outlined"
                  style={{ marginTop: "10px", marginLeft: "1rem" }}
                >
                  Choose Image
                </Button>
              </label>
            </Grid>

            <br />
            <br />
            <FormGroup>
              <FormControlLabel
                required
                control={<Checkbox />}
                label="I here by confirm that above details provided are correct and only used for official purpose."
              />
            </FormGroup>
            <br />
            <Grid sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                sx={{
                  height: "3em",

                  background: "var(--bs-secondary)",
                }}
                variant="contained"
                disableElevation
              >
                Reset
              </Button>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  marginLeft: "1rem",
                }}
              >
                {loading ? <CircularProgress /> : null}
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
            <br></br>
          </form>
        </Paper>
      </LSPage>
    </PageContainer>
  );
}

export default AddEnquire;
