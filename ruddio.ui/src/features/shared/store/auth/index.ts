import { CONFIG } from "@/config";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRES_AT,
  REFRESH_TOKEN_EXPIRES_AT,
  USER_LANGUAGE,
} from "@/features/shared/constants";
import { TLocale } from "@/features/shared/types";
import { clearAuthorizationInfo } from "@shared/utils";
import { ITokenInfo, IUserProfile, IUserState } from "@shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import "moment-timezone";

type TInitialState = {
  user: IUserState;
};

const getInitialState = (): TInitialState => ({
  user: {
    isAuthorized: false,
    timeZoneId: moment.tz.guess(),
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
    accessTokenExpiration: localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT),
    refreshTokenExpiration: localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT),
    isLoading: false,
    email: null,
    userName: null,
    roles: [],
    locale:
      (localStorage.getItem(USER_LANGUAGE) as TLocale) ||
      (CONFIG.DEFAULT_LANG as TLocale),
    isLocalizationLoading: false,
    image: null,
    id: null,
    companies: [],
    phone: null,
    specialist: null,
    admin: null,
    customer: null,
  },
});

const auth = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    signOut: (state) => {
      clearAuthorizationInfo();
      state.user = getInitialState().user;
    },
    tokenReceived: (state, action: PayloadAction<ITokenInfo>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    dataRequested: (state) => {
      state.user = { ...state.user, isLoading: true };
    },
    dataReceived: (state, action: PayloadAction<IUserProfile>) => {
      state.user = {
        ...state.user,
        isLoading: false,
        isAuthorized: true,
        accessToken: localStorage.getItem(ACCESS_TOKEN),
        refreshToken: localStorage.getItem(REFRESH_TOKEN),
        accessTokenExpiration: localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT),
        refreshTokenExpiration: localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT),
        ...action.payload,
      };
    },
    localityRequested: (state) => {
      state.user = { ...state.user, isLocalizationLoading: true };
    },
    localityReceived: (state, action: PayloadAction<TLocale>) => {
      state.user = {
        ...state.user,
        locale: action.payload,
        isLocalizationLoading: false,
      };
    },
  },
});

export const {
  signOut,
  localityRequested,
  dataRequested,
  dataReceived,
  localityReceived,
  tokenReceived,
} = auth.actions;

export default auth;
