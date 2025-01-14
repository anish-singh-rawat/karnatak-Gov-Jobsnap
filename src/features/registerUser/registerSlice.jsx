import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER, getUser } from '../auth/authSlice';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (dataToSubmit, { dispatch }) => {
    try {
      const response = await axios.post(
        `${SERVER}/user/register-labour`,
        dataToSubmit,
      );
      dispatch(registerUserSuccess(response.data));
      dispatch(getUser(dataToSubmit.phone_number));
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error.message;
      }
    }
  },
);
//Initial State
const initialState = {
  userData: null,
  errorData: null,
  loading: false,
  success: false,
  error: false,
  message: null,
};
// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUserSuccess: (state, action) => {
      state.userData = action.payload;
      state.errorData = null;
      state.loading = false;
      state.success = true;
      state.error = false;
      state.message = null;
    },
    errorRegister: (state, action) => {
      state.errorData = action.payload;
      state.userData = null;
      state.loading = false;
      state.success = false;
      state.error = true;
      state.message =
        action.payload.message || 'An error occurred during registration';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.message = null;
        state.userData = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.message = null;
        state.userData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message =
          action.error.message || 'An error occurred during registration';
        state.errorData = action.payload;
      });
  },
});
export const { registerUserSuccess, errorRegister } = userSlice.actions;
export default userSlice.reducer;