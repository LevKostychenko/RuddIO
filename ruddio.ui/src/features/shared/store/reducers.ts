import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import account from "./account";

const rootReducer = combineReducers({
  auth: auth.reducer,
  account: account.reducer,
});

export type TRootState = ReturnType<typeof rootReducer>;

export default rootReducer;
