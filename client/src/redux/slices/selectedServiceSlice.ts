import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedServiceState {
  id: string | null;
  name: string | null;
  serviceImage: string | null;
}

const initialState: SelectedServiceState = {
  id: null,
  name: null,
  serviceImage: null,
};

const selectedServiceSlice = createSlice({
  name: "selectedService",
  initialState,
  reducers: {
    setSelectedService(
      state,
      action: PayloadAction<{ id: string; name: string; serviceImage?: string }>
    ) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.serviceImage = action.payload.serviceImage || null;
    },
    clearSelectedService(state) {
      state.id = null;
      state.name = null;
      state.serviceImage = null;
    },
  },
});

export const { setSelectedService, clearSelectedService } =
  selectedServiceSlice.actions;
export default selectedServiceSlice.reducer;
