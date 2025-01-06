import { TRootState } from "../reducers";
import { IUserState } from "@shared/types";

export const getUser = (state: TRootState): IUserState => state.auth.user;
