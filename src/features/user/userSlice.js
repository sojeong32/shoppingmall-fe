import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 성공
      sessionStorage.setItem("token", response.data.token);
      // Login page 성공시 토스트메세지, navigate처리
      dispatch(
        showToastMessage({
          message: "로그인을 성공했습니다",
          status: "success",
        })
      );
      navigate("/");
      return response.data;
    } catch (error) {
      // 실패
      // 실패시 토스트 메세지 보여주고 생긴 에러값을 reducer에 저장
      dispatch(
        showToastMessage({
          message: "로그인에 실패했습니다",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });
      if (response.status !== 200) throw new Error(response.error);
      sessionStorage.setItem("token", response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    try {
      // 로컬 스토리지의 토큰 제거
      sessionStorage.removeItem("token");

      dispatch(
        showToastMessage({
          message: "로그아웃 되었습니다.",
          status: "success",
        })
      );

      return null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공
      // 1. 성공 토스트 메세지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다",
          status: "success",
        })
      );
      // 2. 로그인 페이지로 리다이렉트
      navigate("/login");

      return response.data.data;
    } catch (error) {
      // 실패
      // 1. 실패 토스트 메세지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다",
          status: "error",
        })
      );
      // 2. 에러값 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload; // loginError에 에러 메시지 저장
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.loginError = null;
        state.registrationError = null;
        state.success = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
