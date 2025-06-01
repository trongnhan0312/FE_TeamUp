import "./style.scss";
import {
  FaServer,
  FaGlobe,
  FaShieldAlt,
  FaAt,
  FaShoppingCart,
  FaCloudUploadAlt,
  FaFileAlt,
} from "react-icons/fa";

const SupportCenter = () => {
  return (
    <div className="support-center">
      <div className="support-header">
        <div className="support-header__content">
          <h1>Support Center</h1>
          <p>
            Browse through our frequently asked questions, tutorials, and other
            self-help resources to find the answers you need.
          </p>
        </div>
      </div>

      <div className="categories-container">
        <CategorySection
          icon={<FaServer />}
          title="Introduction to hosting"
          bgColor="#e8f5e9"
          links={[
            { title: "What is web hosting?" },
            { title: "Types of web hosting" },
            { title: "How to choose a hosting provider?" },
            { title: "Common hosting features to look for" },
            { title: "Pros and cons of different hosting types" },
          ]}
        />

        <CategorySection
          icon={<FaGlobe />}
          title="Setting up a website"
          bgColor="#e3f2fd"
          links={[
            { title: "How to register a domain name?" },
            { title: "How to set up a hosting account?" },
            { title: "How to install and configure a CMS?" },
            { title: "How to upload and manage website files?" },
            { title: "Tips for optimizing website performance" },
          ]}
        />

        <CategorySection
          icon={<FaShieldAlt />}
          title="Security and privacy"
          bgColor="#fce4ec"
          links={[
            { title: "How hosting providers protect web data?" },
            { title: "What is SSL and why is it important?" },
            { title: "How to secure a website with a firewall?" },
            { title: "How to protect sensitive information online?" },
            { title: "Tips for avoiding common security threats" },
          ]}
        />

        <CategorySection
          icon={<FaAt />}
          title="Email hosting"
          bgColor="#fff8e1"
          links={[
            { title: "What is email hosting and why do you need it?" },
            { title: "How to set up and configure email accounts?" },
            { title: "Tips for managing and organizing email" },
            { title: "How to troubleshoot common email issues?" },
            { title: "Pros and cons of different email hosting solutions" },
          ]}
        />

        <CategorySection
          icon={<FaShoppingCart />}
          title="E-commerce hosting"
          bgColor="#e8f5e9"
          links={[
            { title: "What is e-commerce hosting and why you need it?" },
            { title: "How to choose an e-commerce hosting provider?" },
            { title: "Tips for setting up and managing online stores" },
            { title: "How to secure an e-commerce website?" },
            { title: "Common e-commerce hosting features" },
          ]}
        />

        <CategorySection
          icon={<FaCloudUploadAlt />}
          title="Advanced hosting concepts"
          bgColor="#f3e5f5"
          links={[
            { title: "What is a server and how does it work?" },
            { title: "What is a DNS and how does it work?" },
            { title: "What is a CDN and how does it work?" },
            { title: "What is a load balancer?" },
            { title: "What is a reverse proxy?" },
          ]}
        />
      </div>
    </div>
  );
};

const CategorySection = ({ icon, title, links, bgColor }) => {
  return (
    <div className="category-section">
      <div className="category-header" style={{ backgroundColor: bgColor }}>
        <div className="category-icon">{icon}</div>
        <h2>{title}</h2>
      </div>
      <div className="category-links">
        {links.map((link, index) => (
          <div key={index} className="category-link no-click">
            <FaFileAlt className="link-icon" />
            <span>{link.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportCenter;
