import { TRootState } from "../reducers";
import { Point } from "@shared/types";

export const getPassPattern = (state: TRootState): Point[] =>
  state.account.passPattern;
