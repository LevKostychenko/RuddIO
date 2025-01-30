import { AccountLayout } from "@/features/account/components/AccountLayout";
import { ChatLayout } from "@/features/chat/components/ChatLayout";
import { routes } from "@/features/shared/router";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={routes.shared.home.path} element={<ChatLayout />} />;
        <Route path={routes.account.home.path} element={<AccountLayout />} />;
      </Route>
    </Routes>
  );
};
