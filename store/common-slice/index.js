import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/v1/common/hero/get/active`
    );

    return response.data;
  }
);
export const getAllFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/v1/common/hero/get/all`
    );

    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/delete",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/v1/common/hero/delete/${id}`,
    );

    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `http://localhost:5000/api/v1/common/hero/add`,
      { image }
    );

    return response.data;
  }
);

export const updateFeatureImage = createAsyncThunk(
  "/order/updateFeatureImage",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/v1/common/hero/change-active/${id}`,

    );

    return response.data;
  }
)


const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commonSlice.reducer;
