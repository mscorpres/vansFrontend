import useToken from "@/hooks/useToken";
import { RootState } from "@/store";
import React, { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const { token, setToken } = useToken();
  const authStatus: boolean = token ? true : false;
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
  }, [authStatus, authentication]);
  const data = useSelector((state: RootState) => state);
  useEffect(() => {
    if (data?.auth?.token) {
      setToken({ token: data?.auth?.token });
    }
  }, [data]);
  return <>{children}</>;
};

export default Protected;
