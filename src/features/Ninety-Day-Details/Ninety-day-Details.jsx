import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER } from '../auth/authSlice';

export const ninetyDayDetails = createAsyncThunk(
  'labour/ninetyDayDetails',
  async (dataToSubmit, thunkAPI) => {
    try {
      const response = await axios.post(
        `${SERVER}api/user/update-labour-certificate`,
        dataToSubmit,
      );
      console.log('Labour added successfully. Response:', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  data: null,
  error: null,
  loading: false,
};

const labourSlice = createSlice({
  name: 'labour',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(ninetyDayDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ninetyDayDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ninetyDayDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default labourSlice.reducer;