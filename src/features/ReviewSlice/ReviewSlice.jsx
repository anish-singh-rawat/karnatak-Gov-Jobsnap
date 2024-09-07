import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER } from '../auth/authSlice';
import Cookies from 'js-cookie';


export const reviewDetails = createAsyncThunk(
  'labour/getRegisterDetails',
  async (dataToSubmit, thunkAPI) => {
    try {
      const response = await axios.post(
        `${SERVER}api/user/get-user-registration-details`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        },
      );
      console.log('Labour added successfully. Response:', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const finalSubmit = createAsyncThunk(
  'labour/finalSubmit',
  async (dataToSubmit, thunkAPI) => {
    try {
      console.log(dataToSubmit,"ojlhkjgf")
      const response = await axios.post(
        `${SERVER}api/user/registration/submit`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        },
      );
      console.log('Final Submit Successfully. Response:', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// export const finalSubmit = (dataToSubmit) => {
//   console.log('in finalSubmit action:' + JSON.stringify(dataToSubmit));
//   return async (dispatch) => {
//     if (dataToSubmit === 'delete') {
//       dispatch(actions.finalSubmit({ data: null }));
//     } else {
//       try {
//         const response = await axios.post(
//           `${SERVER}/user/registration/submit`,
//           dataToSubmit,
//           {
//             headers: {
//               Authorization: `Bearer ${getTokenCookie()}`,
//             },
//           },
//         );

//         console.log('response:' + JSON.stringify(response.data));
//         dispatch(actions.finalSubmit({ data: response.data }));
//       } catch (error) {
//         // console.log(JSON.stringify(error));
//         // console.log(JSON.stringify(error.response));
//         if (error.response !== undefined) {
//           if (error.response.data !== undefined)
//             dispatch(actions.errorfinalSubmit({ data: error.response.data }));
//         } else {
//           dispatch(actions.errorfinalSubmit({ data: error.message }));
//         }
//       }
//     }
//   };
// };


const initialState = {
  data: null,
  error: null,
  loading: false,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(reviewDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(reviewDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;