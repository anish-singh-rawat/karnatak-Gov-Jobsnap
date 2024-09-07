import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER } from '../../../features/auth/authSlice';

export const getBoardDetails = createAsyncThunk(
  'board/getBoardDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${SERVER}/global/get_board_details?id=${id}`,
      );
      console.log('response:' + JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      console.error(JSON.stringify(error.response));

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getMinistryDetails = createAsyncThunk(
  'board/getMinistryDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER}/global/get_ministry_details`);
      console.log('response:' + JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(JSON.stringify(error));
      console.log(JSON.stringify(error.response));

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    boardDetails: [],
    ministryDetails: [],
    error: null,
    status: 'idle',
  },
  reducers: {
    clearBoardDetails: (state) => {
      state.boardDetails = [];
      state.error = null;
      state.status = 'idle';
    },
    clearMinistryDetails: (state) => {
      (state.ministryDetails = null),
        (state.error = null),
        (state.status = 'idle');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBoardDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.boardDetails = action.payload.data;
      })
      .addCase(getBoardDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getMinistryDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMinistryDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ministryDetails = action.payload.data;
      })
      .addCase(getMinistryDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearBoardDetails, clearMinistryDetails } = boardSlice.actions;
export default boardSlice.reducer;
