import { useEffect, useState } from "react";
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
import Styles from "./AddStudent.module.scss";
import { IconEdit } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GrainIcon from "@mui/icons-material/Grain";
import { useSnackbar } from "notistack";
import { db } from "../../firebase";
import { FormHelperText, FormLabel } from "@mui/joy";
import { Link } from "react-router-dom";
import { SCHOOL_CLASSES, SCHOOL_SECTIONS } from "../../config/schoolConfig";
import { addstudent } from "store/reducers/studentSlice";


function AddStudent() {
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [computerFee, setComputerFee] = useState(0);
  const [transportationFee, setTransportationFee] = useState(0);
  const [admissionFee, setAdmissionFee] = useState(0);
  const [defaultFee, setDefaultFee] = useState(null);
  const [isMonthlyFeeEditable, setIsMonthlyFeeEditable] = useState(true);
  const [isComputerFeeEditable, setIsComputerFeeEditable] = useState(true);
  const [isAdmissionFeeEditable, setIsAdmissionFeeEditable] = useState(true);
  const [isTransportationFeeEditable, setIsTransportationFeeEditable] =
    useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const [formData, setFormData] = useState({
    student_id: "",
    generatedChallans: [],
    student_name: "",
    class_roll: "",
    admission_no: "",
    dob: "",
    date_of_addmission: "",
    gender: "",
    blood_group: "",
    id: "",
    class: null,
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
    created_at: null,
    updated_at: null,
    monthly_fee: null,
    computer_fee: null,
    transportation_fee: null,
    admission_fee: null,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.contact_number.length !== 10) {
      enqueueSnackbar("Please enter correct contact detail!", {
        variant: "error",
      });
      return;
    }

    if (monthlyFee) {
      formData["monthly_fee"] = monthlyFee;
      formData["computer_fee"] = computerFee;
      formData["transportation_fee"] = transportationFee;
      formData["admission_fee"] = admissionFee;

      setLoading(true);
      dispatch(
        addstudent({ studentData: formData, studentProfile: selectedImage })
      )
        .unwrap()
        .then((d) => {
          enqueueSnackbar("Successfully Registered", { variant: "success" });
          setLoading(false);
          setSelectedImage(null);
          setMonthlyFee(0);
          setTransportationFee(0);
          setAdmissionFee(0);
          setComputerFee(0);
          document.getElementById("student-reg-form").reset();
        })
        .catch((e) => {
          console.log({ "dispatch error": e });
          enqueueSnackbar(e, { variant: "error" });
          setLoading(false);
        });
    } else {
      enqueueSnackbar("Please enter monthly fee!", { variant: "error" });
    }
  };

  useEffect(() => {
    db.collection("CONFIG")
      .doc("PAYMENT_CONFIG")
      .get()
      .then((snap) => {
        if (snap.exists) {
          setDefaultFee(snap.data().defaultMonthlyFee);
        }
      });
  }, []);

  useEffect(() => {
    if (formData.class && defaultFee) {
      switch (formData.class) {
        case 1:
          setMonthlyFee(defaultFee.class_1);
          break;
        case 2:
          setMonthlyFee(defaultFee.class_2);
          break;
        case 3:
          setMonthlyFee(defaultFee.class_3);
          break;
        case 4:
          setMonthlyFee(defaultFee.class_4);
          break;
        case 5:
          setMonthlyFee(defaultFee.class_5);
          break;
        case 6:
          setMonthlyFee(defaultFee.class_6);
          break;
        case 7:
          setMonthlyFee(defaultFee.class_7);
          break;
        case 8:
          setMonthlyFee(defaultFee.class_8);
          break;
        case 9:
          setMonthlyFee(defaultFee.class_9);
          break;
        case 10:
          setMonthlyFee(defaultFee.class_10);
          break;
        case 11:
          setMonthlyFee(defaultFee.class_11);
          break;
        case 12:
          setMonthlyFee(defaultFee.class_12);
          break;
        case 13:
          setMonthlyFee(defaultFee.class_13);
          break;
        case 14:
          setMonthlyFee(defaultFee.class_14);
          break;
        default:
          setMonthlyFee(0);
          break;
      }
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
          </div>

          <form onSubmit={handleSubmit} id="student-reg-form">
            <span className={Styles.inputSeperator}>Personal Details</span>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  sx={{ width: "100%", height: "30px" }}
                  label="Name"
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        class: e.target.value,
                      }))
                    }
                    required
                  >
                    {SCHOOL_CLASSES.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.value}>
                          {item.title}
                        </MenuItem>
                      );
                    })}
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
                    {SCHOOL_SECTIONS.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.value}>
                          {item.title}
                        </MenuItem>
                      );
                    })}
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
                <FormControl fullWidth sx={{ m: 1 }} required>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Monthly Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    size="small"
                    type="number"
                    onChange={(e) => setMonthlyFee(parseInt(e.target.value))}
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
                    type="number"
                    onChange={(e) => setComputerFee(parseInt(e.target.value))}
                    disabled={isComputerFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={computerFee}
                    label="Computer Fee"
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
                    type="number"
                    onChange={(e) =>
                      setTransportationFee(parseInt(e.target.value))
                    }
                    disabled={isTransportationFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={transportationFee}
                    label="Transportation Fee"
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
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Admission Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    size="small"
                    type="number"
                    onChange={(e) => setAdmissionFee(parseInt(e.target.value))}
                    disabled={isAdmissionFeeEditable}
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    value={admissionFee}
                    label="Admission Fee"
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
                    alt="hinchik dhinchik"
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

export default AddStudent;
