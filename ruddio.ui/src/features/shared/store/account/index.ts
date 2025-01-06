import { Point } from "@/features/shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import "moment-timezone";

type TInitialState = {
  passPattern: Point[];
};

const getInitialState = (): TInitialState => ({
  passPattern: [],
});

const account = createSlice({
  name: "account",
  initialState: getInitialState(),
  reducers: {
    setPassPattern: (state, action: PayloadAction<Point[]>) => {
      state.passPattern = action.payload;
    },
  },
});

export const { setPassPattern } = account.actions;

export default account;
