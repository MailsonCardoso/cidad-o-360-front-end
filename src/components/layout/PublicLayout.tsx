import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="print:hidden"><Header /></div>
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="print:hidden"><Footer /></div>
      <div className="print:hidden"><WhatsAppButton /></div>
    </div>
  );
};

export default PublicLayout;
