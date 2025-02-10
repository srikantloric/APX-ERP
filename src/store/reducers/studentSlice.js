import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db, auth, storageRef } from "../../firebase";
import firebase from '../../firebase'

import { Alert } from "../../components/Utils/Alert";
import { FEMALE_DUMMY, MALE_DUMMY } from "../../assets/dummyProfil";
import FileResizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(file, 500, 500, "WEBP", 100, 0, (uri) => {
      resolve(uri);
    });
  });

  const generateFirebaseUID = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uid = "";
    for (let i = 0; i < 28; i++) {
      uid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return uid;
  };

//ADD STUDENT
export const addstudent = createAsyncThunk(
  "add-students/addstudent",
  async ({ studentData }, { rejectWithValue }) => {
    console.log("From Student Slice",studentData)
    try {
      // Fetch previous admission count
      const prevAdmissionDoc = await db
        .collection("ADMISSION_TRACKER")
        .doc("admission_number_tracker")
        .get();

      if (!prevAdmissionDoc.exists) {
        throw new Error("Error fetching previous admission number.");
      }

      const prevAdmissionNumber = prevAdmissionDoc.data().total_count;
      const formattedCountValue = String(prevAdmissionNumber + 1).padStart(5, "0");

      // Extract password from DOB and generate email
      const userPass = studentData.dob.split("-").reverse().join(""); 
      const userEmail = `apx2025${formattedCountValue}@gmail.com`;

      const docId = generateFirebaseUID();
     
      studentData = {
        ...studentData,
        student_id: userEmail,
        student_pass: userPass,
        id:docId,
        admission_no: `APX2025${formattedCountValue}`,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const studentRef = db.collection("STUDENTS").doc(docId);
      const admissionTrackerRef = db.collection("ADMISSION_TRACKER").doc("admission_number_tracker");

      // Firestore Transaction to update admission tracker and save student data
      await db.runTransaction(async (trx) => {
        const countDoc = await trx.get(admissionTrackerRef);
        if (!countDoc.exists) throw new Error("Document does not exist.");

        const newSerialNumber = countDoc.data().total_count + 1;
        trx.update(admissionTrackerRef, {
          total_count: newSerialNumber,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        trx.set(studentRef, studentData);
      });
      return studentData;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);


//FETCH STUDENT
export const fetchstudent = createAsyncThunk("student/fetchstudent", () => {
  console.log("fetch data query triggered");
  return db
    .collection("STUDENTS")
    .orderBy("created_at","desc")
    .get()
    .then((snap) => {
      const students = [];
      snap.forEach((doc) => {
        students.push({ ...doc.data(), id: doc.id });
      });
      return students;
    });

  // console.log(students);
  // return students;
});

//DELETE STUDENT
export const deleltedata = createAsyncThunk(
  "student/deletestudent",
  async (id) => {
    console.log("deleting Student:", id);
    return db
      .collection("STUDENTS")
      .doc(id)
      .delete()
      .then(() => {
        return id;
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
);

//UPDATE STUDENT
export const updatedatastudent = createAsyncThunk(
  "student/updatestudent",
  async ({ studentdata, imageupdate }, { rejectWithValue }) => {
    let studentData = { ...studentdata };
    try {
      studentData["updated_at"] = firebase.firestore.FieldValue.serverTimestamp()
      if (imageupdate) {
        console.log("updating new image..");
        const fileRef = storageRef.child(
          `profileImages/${studentData.id}/${studentData.email}`
          );

          const resizedImage = await resizeFile(imageupdate);
          const uploadTask = await fileRef.putString(resizedImage, "data_url");
          console.log(uploadTask.state);
          if (uploadTask.state === "success") {
            const url = await fileRef.getDownloadURL();
            console.log(url);
            console.log(studentData);
            studentData["profil_url"] = url;
            await db.collection("STUDENTS").doc(studentData.id).set(studentData);
            console.log(studentData)
            Alert("Updated Succesfully...");
            return studentData;
          } else {
            console.log("some went wrong while uploading image..");
          }
        } else {
          await db.collection("STUDENTS").doc(studentData.id).set(studentData);
          Alert("Updated Succesfully...");
          return studentData;
      }
    } catch (e) {
      console.log(e);
    }
  }
);

const studentslice = createSlice({
  name: "student",
  initialState: {
    studentarray: [],
    loading: true,
    error: null,
  },
  // reducers:{

  // },
  extraReducers: {
    [addstudent.pending]: (state) => {
      state.loading = true;
    },

    [addstudent.fulfilled]: (state, action) => {
      state.loading = false;
      console.log("addstudent payload : ", action.payload);
      state.studentarray.push(action.payload);
    },
    [addstudent.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [fetchstudent.pending]: (state) => {
      state.loading = true;
    },
    [fetchstudent.fulfilled]: (state, action) => {
      state.loading = false;
      state.studentarray = action.payload;
    },
    [fetchstudent.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleltedata.pending]: (state) => {
      state.loading = true;
    },
    [deleltedata.fulfilled]: (state, action) => {
      state.loading = false;
      state.studentarray = state.studentarray.filter(
        (student) => student.id !== action.payload
      );
    },
    [deleltedata.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updatedatastudent.pending]: (state) => {
      state.loading = true;
    },

    [updatedatastudent.fulfilled]: (state, action) => {
      state.loading = false;
      const payload = action.payload;
      console.log(payload);
      const studentindex = state.studentarray.findIndex(
        (student) => student.id === payload.id
      );
      if (studentindex !== -1) {
        state.studentarray[studentindex] = payload;
        console.log("sate updated");
      }
    },
    [updatedatastudent.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
  //   extraReducers: (builder) => {
  //     builder.addCase(addstudent.pending, (state) => {
  //       state.loading = true;
  //     })
  //     builder
  //       .addCase(addstudent.fulfilled, (state, action) => {
  //         state.loading = false;
  //         state.studentarray.push(action.payload);
  //       })
  //       builder.addCase(addstudent.rejected, (state, action) => {
  //         state.loading = false;
  //         state.error = action.payload;
  //       })
  //       .addCase(fetchstudent.fulfilled, (state, action) => {
  //         state.studentarray = action.payload;
  //       });

  //   },
});
export default studentslice.reducer;


