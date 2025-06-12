import { memo } from "react";
import HeaderOwner from "./headerOwner";
import FooterOwner from "./footerOwner";

const OwnerLayout = ({ children, ...props }) => {
  return (
    <div {...props}>
      <HeaderOwner />
      {children}
      <FooterOwner />
    </div>
  );
};

export default memo(OwnerLayout);
