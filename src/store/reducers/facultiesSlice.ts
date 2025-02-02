import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { FacultyType } from "types/facuities";



interface FacultyState {
  teacherArray: FacultyType[];
  loading: boolean;
  error: string | null;
}

//FETCH
export const fetchTeacher = createAsyncThunk<FacultyType[], void>(
  "teachers/fetchTeacher",
  async () => {
    const snap = await db.collection("FACULTIES").get();
    const teachers: FacultyType[] = [];
    snap.forEach((doc) => {
      teachers.push({ ...doc.data(), id: doc.id } as FacultyType);
    });
    sessionStorage.setItem("faculties_list", JSON.stringify(teachers));
    return teachers;
  }
);

const initialState: FacultyState = {
  teacherArray: [],
  loading: false,
  error: null,
};

const facultiesSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacher.fulfilled, (state, action: PayloadAction<FacultyType[]>) => {
        state.loading = false;
        state.teacherArray = action.payload;
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default facultiesSlice.reducer;
