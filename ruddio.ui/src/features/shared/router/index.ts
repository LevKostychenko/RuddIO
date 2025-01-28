export type AppRouteName =
  | "home"
  | "account"
  | "account.register"
  | "account.login";
export type AppRoute = {
  name: AppRouteName;
  path: string;
};
export type AppRoutes = {
  shared: {
    home: AppRoute;
  };
  account: {
    home: AppRoute;
    regiter: AppRoute;
    login: AppRoute;
  };
};

export const routes: AppRoutes = {
  shared: {
    home: {
      name: "home",
      path: "/",
    },
  },
  account: {
    home: {
      name: "account",
      path: "account",
    },
    login: {
      name: "account.login",
      path: "account/login",
    },
    regiter: {
      name: "account.register",
      path: "account/register",
    },
  },
};
