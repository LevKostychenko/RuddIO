export type AppRouteName = "home";
export type AppRoute = {
  name: AppRouteName;
  path: string;
};
export type AppRoutes = {
  shared: {
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
};
