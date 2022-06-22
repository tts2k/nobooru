import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  navbarHide: true
}

export const navbarSlice = createSlice({
  name: 'navbarToggle',
  initialState,
  reducers: {
    enableNavbar: (state) => {
      state.navbarHide = false;
    },
    disableNavbar: (state) => {
      state.navbarHide = true;
    }
  }
})

export const { enableNavbar, disableNavbar } = navbarSlice.actions;

export default navbarSlice.reducer;
