import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalReviews: 0,
  },
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/v1/shop/review/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formdata),
    });

    const data = await response.json();
    return data;
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async ({ id, page }) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/shop/review/reviews?productId=${id}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = false;
        state.reviews = [];
        state.pagination = {
          currentPage: 1,
          totalPages: 0,
          totalReviews: 0,
        };
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.reviews = action.payload.data.reviews;
          state.pagination = {
            currentPage: action.payload.data.pagination.currentPage,
            totalPages: action.payload.data.pagination.totalPages,
            totalReviews: action.payload.data.pagination.totalReviews,
          };
        }
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.pagination = {
          currentPage: 1,
          totalPages: 0,
          totalReviews: 0,
        };
        console.error("Error fetching reviews:", action.payload);
      });
  },
});

export default reviewSlice.reducer;
