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
//ADD STUDENT
export const addstudent = createAsyncThunk(
  "add-students/addstudent",
  async ({ studentData, studentProfile }, { rejectWithValue }) => {
    ///fetch previous admission count
    const prevAdmissionNumber = await db
      .collection("ADMISSION_TRACKER")
      .doc("admission_number_tracker")
      .get();
    console.log(prevAdmissionNumber.data());

    if (prevAdmissionNumber.exists) {

      const formatedCountValue = String(
        prevAdmissionNumber.data().total_count + 1
      ).padStart(5, "0");
      console.log(formatedCountValue);

      let userPass = String(studentData.dob).split("-").reverse().join(""); //extracting password from dob
      const userEmail = "ops2024" + formatedCountValue + "@gmail.com"; // creating userID using admission no
      studentData["student_id"] = userEmail;
      studentData["student_pass"] = userPass;
      studentData["admission_no"] = "OPS2024"+formatedCountValue;
      studentData["created_at"] =firebase.firestore.FieldValue.serverTimestamp()
      console.log(userPass);

      // / Creating user in db
      return auth
        .createUserWithEmailAndPassword(userEmail, userPass)
        .then((user) => {
          const userId = user.user.uid;
          studentData["id"] = userId;
          //adding user to db
          const studentRef = db.collection("STUDENTS").doc(userId);
          const admissionNumberTrackerRef = db
            .collection("ADMISSION_TRACKER")
            .doc("admission_number_tracker");

          return db
            .runTransaction((trx) => {
              return trx.get(admissionNumberTrackerRef).then((countData) => {
                if (!countData.exists) {
                  throw Object.assign(
                    new Error("Document does not exisit"),
                    { code: 402 }
                 );
                }

                var newSerialNumber = countData.data().total_count + 1;

                trx.update(admissionNumberTrackerRef, {
                  total_count: newSerialNumber,
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                trx.set(studentRef, studentData);
                return studentData;
           
              });
            })
            .then((studentData) => {
              console.log("Transaction successfull", studentData);
              ///uploading user profile in storage
              if (studentProfile) {
                const fileRef = storageRef.child(
                  `profileImages/${userId}/${studentData.email}`
                );
                resizeFile(studentProfile).then((img) => {
                  // const uploadTask = fileRef.put(img);
                  const uploadTask = fileRef.putString(img, "data_url");
                  uploadTask.on(
                    "state_changed",
                    function (snapshot) {},
                    function (error) {
                      return rejectWithValue(error);
                    },
                    function () {
                      fileRef.getDownloadURL().then((url) => {
                        let fData = {
                          profil_url: url,
                        };
                        studentData["profil_url"] = url;
                        studentData["updated_at"] =firebase.firestore.FieldValue.serverTimestamp()

                        ///saving image url in doc
                        return db
                          .collection("STUDENTS")
                          .doc(userId)
                          .update(fData)
                          .then(() => {
                            return studentData;
                          })
                          .catch((er) => {
                            return rejectWithValue(er);
                          });
                      });
                    }
                  );
                });
              } else {
                let fData = {
                  profil_url:
                    studentData.gender === "male" ? MALE_DUMMY : FEMALE_DUMMY,
                };
                studentData["profil_url"] = fData.profil_url;
                studentData["updated_at"] =firebase.firestore.FieldValue.serverTimestamp()
                ///saving image url in doc
                return db
                  .collection("STUDENTS")
                  .doc(userId)
                  .update(fData)
                  .then(() => {
                    return studentData;
                  })
                  .catch((er) => {
                    console.log(er)
                    return rejectWithValue(er);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              return rejectWithValue(err);
            });

          //   return db
          //   .collection("STUDENTS")
          //   .doc(userId)
          //   .set(studentData)
          //   .then((snapshot) => {

          //       })
          //       .catch((error) => {
          //       console.log(error);
          //       return rejectWithValue(error);
          //     });
        })
        .catch((error) => {
          console.log(error);
          return rejectWithValue(error);
        });
    } else {
      console.log("error fetching previous admission number...");
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


