import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";

const rootReducer = combineReducers({
  auth: auth.reducer,
});

export type TRootState = ReturnType<typeof rootReducer>;

export default rootReducer;
