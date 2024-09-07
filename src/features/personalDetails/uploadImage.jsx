import axios from 'axios';
import Cookies from 'js-cookie';
import { SERVER } from '../auth/authSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const uploadFileAPI = createAsyncThunk(
    'labour/uploadFileAPI',
    async ( fileData, filename, userID, fileType, thunkAPI) => {
      try {
        const FormData = await import('form-data');
        const data = new FormData.default();
        data.append('file', fileData);
        data.append('userId', userID);
        data.append('fileType', fileType);
        const response = await axios.post(
          `${SERVER}api/upload/file`,
          data,
          {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${Cookies.get('jwt')}`,
              },
          }
        );
        console.log(response)
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    },
  );
