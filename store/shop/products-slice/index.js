import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  hasMore: true, // Track if there are more products to load
};

export const fetchFeaturedProducts = createAsyncThunk(
  "/products/fetchFeaturedProducts",
  async ({ filterParams, sortParams, page, limit = 4 }) => {

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page: page.toString(),
      limit: limit.toString(),
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/shop/products/get?${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
);

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page, limit = 10 }) => {

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page: page.toString(),
      limit: limit.toString(),
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/shop/products/get?${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/shop/products/get/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    setProducts: (state, action) => {
      state.productList = action.payload.productList;
    },
    clearProducts: (state) => {
      state.productList = []; // Clears the product list
      state.hasMore = true;  // Reset pagination status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {

          const { products, pagination } = action.payload.data;

          // Append new products to the existing product list
          state.productList = [...state.productList, ...products.filter(
            (product) => !state.productList.some((p) => p._id === product._id)
          ),];
          state.hasMore = pagination.currentPage < pagination.totalPages; // Determine if there are more pages
        }

      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        state.hasMore = false; // No more pages if fetching fails
      })

      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.productList = [];
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { products } = action.payload.data;

        // Append new products to the existing product list
        state.productList = products;
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        state.hasMore = false; // No more pages if fetching fails
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, setProducts, clearProducts } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
