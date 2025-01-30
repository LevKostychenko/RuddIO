import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuthorizationInfo } from "../../utils";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const presentPage = () => {
    navigate(-1);
  };

  useEffect(() => {
    const info = getAuthorizationInfo();
    if (!info?.accessToken || !info?.refreshToken) {
      presentPage();
    }
  }, []);

  return <Outlet />;
};
