import { PropsWithChildren, useEffect } from "react";
import { routes } from "../../router";
import { Route, Routes, matchPath, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/auth/selectors";
import { dataReceived, dataRequested, signOut } from "../../store/auth";
import { Login } from "@/features/account/components/Login";
import { Register } from "@/features/account/components/Register";
import ApiContext from "../../services/api-context";
import { IUserProfile } from "../../types";
import { getDefaultInterceptors } from "../../utils/request/interceptors";

export const DetectAuth = ({ children }: PropsWithChildren) => {
  const { isAuthorized, isLoading, accessToken, refreshToken } =
    useSelector(getUser);
  const location = useLocation();
  const dispatch = useDispatch();

  const AUTH_ROUTES = [routes.account.login.path, routes.account.regiter.path];

  const GUEST_AVAILABLE_ROUTES = [...AUTH_ROUTES];

  useEffect(() => {
    console.log(accessToken, refreshToken);
    if (!isLoading && !isAuthorized && accessToken && refreshToken) {
      dispatch(dataRequested());
      // loader.start();
      new ApiContext()
        .identity()
        .getService("account")
        .useMany(getDefaultInterceptors())
        .get()
        .then((u) => dispatch(dataReceived(u.data as IUserProfile)))
        .catch((e) => {
          console.log(e);
          dispatch(signOut());
        })
        .finally();
    }
  }, [isAuthorized, isLoading, accessToken, refreshToken]);

  const checkRoutes = (routesList: string[], pathName: string) =>
    routesList.some((route) => {
      const match = matchPath(pathName, route);
      return match;
    });

  const isGuestPage = checkRoutes(GUEST_AVAILABLE_ROUTES, location.pathname);
  const isLoginPage = checkRoutes(AUTH_ROUTES, location.pathname);

  if (isLoginPage) {
    return (
      <Routes>
        <Route path={routes.account.login.path} element={<Login />} />
        <Route path={routes.account.regiter.path} element={<Register />} />
      </Routes>
    );
  }

  // if ((!accessToken || !refreshToken) && !isGuestPage && !isLoginPage) {
  //   return (
  //     <AuthLayout>
  //       <SignIn />
  //     </AuthLayout>
  //   );
  // }

  return children;
};
