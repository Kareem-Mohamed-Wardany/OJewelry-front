import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: "",
  expiryDate: "",
  isAdmin: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.role === 'admin' ? true : false : false
};

// Helper to access localStorage safely

// Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {

    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // Save credentials to localStorage
    if (data.success) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      localStorage.setItem("expiryDate", expiryDate);
    }

    return data;

  }
);


// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated || !!action.payload.user;
      state.token = action.payload.token || "";
      state.expiryDate = action.payload.expiryDate || "";
      state.isAdmin = action.payload.user.role === 'admin' ? true : false;
    },
    setLogOut: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expiryDate");
      state.user = null;
      state.isAuthenticated = false;
      state.token = "";
      state.expiryDate = "";
      state.isAdmin = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.msg = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.msg = action.payload || "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.msg = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.data.user : null;
        state.token = action.payload.success ? action.payload.data.token : "";
        state.isAdmin = action.payload.data?.user.role === 'admin' ? true : false;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.msg = action.payload || "Login failed";
      })
  },
});
export const { setUser, setLogOut } = authSlice.actions;

export default authSlice.reducer;
