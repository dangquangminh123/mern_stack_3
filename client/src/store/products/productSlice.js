import { createSlice } from "@reduxjs/toolkit";
import {getNewProducts} from "./asyncActions";

export const productSlice = createSlice({
  name: "app",
  initialState: {
    newProducts: null,
    errorMessage: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action (Promise pending)
    builder.addCase(getNewProducts.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });
    // Khi thực hiện action thành công (Promise fulfilled)
    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      // Tắt trạng thái loading lưu thông tin action vào store
      state.isLoading = false;
      state.newProducts = action.payload;
    });
    // Khi thực hiện action thất bại (Promise reject)
    builder.addCase(getNewProducts.rejected, (state, action) => {
      // Tắt trạng thái loading lưu thông tin thất bại vào store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

// export const {  } = appSlice.actions

export default productSlice.reducer;
