
import React from "react";
import Navbar from '../components/Navigation/Navigation.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar /> {}
      <div>{children}</div>{}
    </div>
  );
};

export default Layout;
