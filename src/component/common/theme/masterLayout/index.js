import { memo } from "react";
import Header from "../header";
import Footer from "../footer";
import ChatWidget from "../../../chatAI/ChatWidget";

const masterLayout = ({ children, ...props }) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      {children}
      <ChatWidget />;
      <Footer />
    </div>
  );
};

export default memo(masterLayout);
