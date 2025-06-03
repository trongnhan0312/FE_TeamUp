import { memo } from "react";
import HeaderCoach from "./headerCoach";
import FooterCoach from "./footerCoach";

const CoachLayout = ({ children, ...props }) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HeaderCoach />
      <main style={{ flex: 1 }}>{children}</main>
      <FooterCoach />
    </div>
  );
};

export default memo(CoachLayout);
