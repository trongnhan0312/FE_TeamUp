import { memo } from "react";
import HeaderCoach from "./headerCoach";
import FooterCoach from "./footerCoach";

const CoachLayout = ({ children, ...props }) => {
  return (
    <div {...props}>
      <HeaderCoach />
      {children}
      <FooterCoach />
    </div>
  );
};

export default memo(CoachLayout);
