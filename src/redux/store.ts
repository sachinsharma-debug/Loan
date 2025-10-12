import { configureStore } from "@reduxjs/toolkit";
import storeSlice from "./storeSlice";

export const store = configureStore({
  reducer: {
    Store: storeSlice,
  },
});

// Inferred type: {Store: ReturnType<typeof storeSlice>}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
