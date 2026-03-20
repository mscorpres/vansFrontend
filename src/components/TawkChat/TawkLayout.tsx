import TawkToChat from "./TawkChat";

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <TawkToChat />
    </>
  );
}