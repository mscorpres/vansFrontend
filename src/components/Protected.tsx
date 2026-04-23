import useToken from "@/hooks/useToken";
import { RootState } from "@/store";
import React, { useEffect, useLayoutEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { saveReturnTo } from "@/utils/authReturnTo";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const { token, setToken } = useToken();
  const authStatus: boolean = Boolean(token);
  const location = useLocation();

  const shouldRedirectToLogin = authentication && !authStatus;
  const shouldRedirectToHome = !authentication && authStatus;

  /** Save before redirect; do not mount protected children (avoids API 401 clearing sessionStorage). */
  useLayoutEffect(() => {
    if (shouldRedirectToLogin && location.pathname !== "/login") {
      saveReturnTo(`${location.pathname}${location.search}`);
    }
  }, [shouldRedirectToLogin, location.pathname, location.search]);

  const data = useSelector((state: RootState) => state);
  useEffect(() => {
    if (data?.auth?.token) {
      setToken({ token: data?.auth?.token });
    }
  }, [data?.auth?.token, setToken]);

  if (shouldRedirectToLogin) {
    return <Navigate to="/login" replace />;
  }
  if (shouldRedirectToHome) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default Protected;
