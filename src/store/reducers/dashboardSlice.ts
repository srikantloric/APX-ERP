import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import firebase from "../../firebase";


type DashboardAnalyticsType = {
  lastUpdated: firebase.firestore.Timestamp,
  totalFeeCollection: {
    thisMonth: number,
    thisYear: number,
    today: number
  }
  ,
  totalStudent: number
}

// Define the shape of the state
interface DashboardAnalyticsState {
  dashboardAnalytics: DashboardAnalyticsType;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Create an async thunk for fetching total students
export const fetchTotalStudents = createAsyncThunk<DashboardAnalyticsType, void, { rejectValue: string }>(
  "analytics/getDashboardAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await db.collection("ANALYTICS").doc("dashboardAnalytics").get();
      const dashboardAnalyticsData = response.data() as DashboardAnalyticsType;
      return dashboardAnalyticsData;
    } catch (err: any) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

// Create the slice
const dashboardAnalyticsSlice = createSlice({
  name: "studentCount",
  initialState: {
    dashboardAnalytics: {},
    status: "idle",
    error: null,
  } as DashboardAnalyticsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalStudents.fulfilled, (state, action: PayloadAction<DashboardAnalyticsType>) => {
        state.status = "succeeded";
        state.dashboardAnalytics = action.payload;
      })
      .addCase(fetchTotalStudents.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Export the reducer
export default dashboardAnalyticsSlice.reducer;
