import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false
  },
  reducers: {
    login: (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
        state.token = action.payload.token
        // state.current = action.payload.userData
    },
    logout: (state, action) => {
      state.isLoggedIn = false
      state.token = null
    },
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action (Promise pending)
    builder.addCase(actions.getCurrent.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });
    // Khi thực hiện action thành công (Promise fulfilled)
    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      // Tắt trạng thái loading lưu thông tin action vào store
      state.isLoading = false;
      console.log(action.payload);
      state.current = action.payload;
    });
    // Khi thực hiện action thất bại (Promise reject)
    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      // Tắt trạng thái loading lưu thông tin thất bại vào store
      state.isLoading = false;
      state.current = null;
    });
  },
});

export const { login, logout } = userSlice.actions

export default userSlice.reducer;
