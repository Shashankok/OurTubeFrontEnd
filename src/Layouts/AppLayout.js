import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import Header from "../components/Header";
import MiniSideNav from "../components/MiniSideNav";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
        <MiniSideNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
