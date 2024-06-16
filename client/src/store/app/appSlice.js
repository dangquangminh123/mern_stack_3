import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
    isShowModal: false,
    modalChildren: null
  },
  reducers: {
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal
      state.modalChildren = action.payload.modalChildren
    }
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action (Promise pending)
    builder.addCase(actions.getCategories.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });
    // Khi thực hiện action thành công (Promise fulfilled)
    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      // Tắt trạng thái loading lưu thông tin action vào store
      state.isLoading = false;
      state.categories = action.payload;
    });
    // Khi thực hiện action thất bại (Promise reject)
    builder.addCase(actions.getCategories.rejected, (state, action) => {
      // Tắt trạng thái loading lưu thông tin thất bại vào store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export const { showModal } = appSlice.actions

export default appSlice.reducer;
