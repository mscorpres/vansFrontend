import React from "react";

function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-[100vh]  ">
      <div className="flex items-center justify-center py-12 bg-no-repeat">{props.children}</div>
      <div className="hidden lg:block bg-[url(/login.png)] bg-contain bg-no-repeat"></div>
    </div>
  );
}
export default AuthLayout;
