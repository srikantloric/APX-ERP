import React, { useEffect, useState } from "react";
import PageContainer from "../../components/Utils/PageContainer";
import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Styles from "./AddStudent.module.scss";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { updatedatastudent } from "store/reducers/studentSlice";


function UpdateStudent() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileimage] = useState("");
  const [loading, setLoading] = useState(false);
  const users = useSelector((state) => state.students.studentarray);
  const [editable, setEditable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    setLoading(true);
    if (users.length !== 0) {
      if (id) {
        const sigledata = users.filter((ele) => ele.id === id);
        setFormData(sigledata[0]);
        setProfileimage(sigledata[0].profil_url);
        setLoading(false);
      }
    } else {
      console.log("called db");
      db.collection("STUDENTS")
        .doc(id)
        .get()
        .then((data) => {
          if (data.exists) {
            setFormData(data.data());
            setProfileimage(data.data().profil_url);
            setLoading(false);
          }
          console.log(data.data())
        });
    }
  }, [id, users]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const updateStudentData = (e) => {
    e.preventDefault();
    setIsUpdating(true)
    dispatch(
      updatedatastudent({
        studentdata: formData,
        imageupdate: selectedImage,
      })
    )
      .unwrap()
      .then((msg) => {
        if (msg) {
          setEditable(false);
          setIsUpdating(false)
        }
      });
  };


  const canclebutton = () => {
    window.history.back();
  };

  const handleSwitch = (e) => {
    setEditable(e.target.checked);
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        {loading ? (
          <LinearProgress />
        ) : (
          <Paper
            sx={{ padding: "10px 30px", margin: "0px 10px " }}
            className={Styles.paper}
          >
            <div className={Styles.pageHeader}>
              <h3>Update Student Data</h3>
              <FormGroup>
                <FormControlLabel
                  control={<Switch onChange={handleSwitch} />}
                  label="Edit"
                  labelPlacement="start"
                />
              </FormGroup>
            </div>

            <form onSubmit={updateStudentData}>
              <span className={Styles.inputSeperator}>Personal Details</span>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Name"
                    disabled={!editable}
                    value={formData.student_name}
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
                    <InputLabel id="demo-simple-select-label">Class</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Class"
                      disabled={!editable}
                      value={formData.class}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          class: e.target.value,
                        }))
                      }
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
                    <InputLabel id="demo-simple-select-label">
                      Section
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formData.section}
                      label="SECTION"
                      disabled={!editable}
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
                    disabled={!editable}
                    variant="outlined"
                    value={formData.class_roll}
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
                    disabled={!editable}
                    variant="outlined"
                    value={formData.dob}
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
                    disabled={!editable}
                    value={formData.date_of_addmission}
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
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Gender"
                      disabled={!editable}
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
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
                    disabled={!editable}
                    value={formData.blood_group}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        blood_group: e.target.value,
                      }))
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Religion"
                    disabled={!editable}
                    variant="outlined"
                    value={formData.religion}
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
                    disabled={!editable}
                    value={formData.cast}
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
                    disabled={!editable}
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
                    disabled={!editable}
                    value={formData.father_name}
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
                    disabled={!editable}
                    value={formData.father_occupation}
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
                    disabled={!editable}
                    value={formData.father_qualification}
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
                    disabled={!editable}
                    value={formData.mother_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        Mothername: e.target.value,
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
                    disabled={!editable}
                    value={formData.mother_occupation}
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
                    disabled={!editable}
                    value={formData.motherqualifiation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        motherqualifiation: e.target.value,
                      }))
                    }
                    variant="outlined"
                    required
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
                    disabled={!editable}
                    value={formData.contact_number}
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
                    disabled={!editable}
                    value={formData.alternate_number}
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
                    variant="outlined"
                    disabled={!editable}
                    value={formData.email}
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
                    disabled={!editable}
                    value={formData.address}
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
                    label="City"
                    disabled={!editable}
                    value={formData.city}
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
                    label="State"
                    variant="outlined"
                    required
                    disabled={!editable}
                    value={formData.state}
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
                    variant="outlined"
                    disabled={!editable}
                    value={formData.postal_code}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        postal_code: e.target.value,
                      }))
                    }
                    required
                  />
                </Grid>

                <Typography
                  variant="h6"
                  marginLeft="1rem"
                  width="100%"
                  gutterBottom
                  marginTop="10px"
                >
                  Profile Image Upload
                </Typography>
                <br></br>

                <input
                  type="file"
                  accept="image/png ,image/jpeg"
                  style={{ display: "none" }}
                  id="imageInput"
                  disabled={!editable}
                  onChange={handleImageChange}
                />
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      marginLeft: "20px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <img
                    src={profileImage}
                    alt="Selected Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      marginLeft: "20px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <br></br>
                <label htmlFor="imageInput">
                  <Button
                    component="span"
                    variant="outlined"
                    disabled={!editable}
                    style={{ marginTop: "10px", marginLeft: "1rem" }}
                  >
                    Edit Image
                  </Button>
                </label>
              </Grid>

              <br />
              <Grid md={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                  }}
                >
                  <Button
                    sx={{
                      height: "3em",
                    }}
                    variant="outlined"
                    disableElevation={true}
                    onClick={canclebutton}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "var(--bs-primary)",
                      marginLeft: "1rem",
                    }}
                    type="submit"
                    disableElevation={true}
                    disabled={isUpdating}

                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
              <br></br>
            </form>
          </Paper>
        )}
      </LSPage>
    </PageContainer>
  );
}

export default UpdateStudent;
