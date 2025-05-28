import { memo } from "react";
import Header from "../header";
import Footer from "../footer";
import ChatWidget from "../../../chatAI/ChatWidget";

const masterLayout = ({ children, ...props }) => {
  return (
    <div {...props}>
      <Header />
      {children}
      <ChatWidget />;
      <Footer />
    </div>
  );
};

export default memo(masterLayout);
