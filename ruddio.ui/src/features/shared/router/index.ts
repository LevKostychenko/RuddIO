export type AppRouteName = "home" | "account";
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
  },
};
