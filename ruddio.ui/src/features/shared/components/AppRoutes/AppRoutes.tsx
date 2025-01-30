import { AccountLayout } from "@/features/account/components/AccountLayout";
import { Login } from "@/features/account/components/Login";
import { Register } from "@/features/account/components/Register";
import { ChatLayout } from "@/features/chat/components/ChatLayout";
import { routes } from "@/features/shared/router";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.shared.home.path} element={<ChatLayout />} />;
      <Route path={routes.account.home.path} element={<AccountLayout />} />;
      <Route path={routes.account.regiter.path} element={<Register />} />;
      <Route path={routes.account.login.path} element={<Login />} />;
    </Routes>
  );
};
