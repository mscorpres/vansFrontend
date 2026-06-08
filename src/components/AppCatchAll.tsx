import useToken from "@/hooks/useToken";
import LogningV2 from "@/pages/WarehouseModule/LogningV2";
import Custom404Page from "@/pages/Custom404Page";
import MainLayout from "@/layouts/MainLayout";
import React, { useLayoutEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { saveReturnTo } from "@/utils/authReturnTo";
import Protected from "./Protected";

/**
 * Unknown paths hit this route. When logged out, show login (including
 * `/login/...` callbacks like `/login/login_auth?redirectTo=`) instead of 404.
 */
const AppCatchAll: React.FC = () => {
  const { token } = useToken();
  const location = useLocation();
  const isLoggedIn = Boolean(token);

  const isLoginSubPath = location.pathname.startsWith("/login/");

  useLayoutEffect(() => {
    if (!isLoggedIn && !isLoginSubPath) {
      saveReturnTo(`${location.pathname}${location.search}`);
    }
  }, [isLoggedIn, isLoginSubPath, location.pathname, location.search]);

  if (!isLoggedIn && isLoginSubPath) {
    return (
      <Protected authentication={false}>
        <LogningV2 />
      </Protected>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Custom404Page />
    </MainLayout>
  );
};

export default AppCatchAll;
