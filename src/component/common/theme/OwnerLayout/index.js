import { memo } from "react";
import HeaderOwner from "./headerOwner";
import FooterOwner from "./footerOwner";

const OwnerLayout = ({ children, ...props }) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HeaderOwner />
      {children}
      <FooterOwner />
    </div>
  );
};

export default memo(OwnerLayout);
