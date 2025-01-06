import { ChatLayout } from "@/features/chat/components/ChatLayout";
import { routes } from "@/features/shared/router";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.shared.home.path} element={<ChatLayout />} />;
    </Routes>
  );
};
