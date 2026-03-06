import Navbar from "../includes/Navbar";
import Flash from "../includes/Flash";
import Footer from "../includes/Footer";
import "./Boilerplate.css";

export default function Boilerplate({ children, onNavigate }) {
  return (
    <div className="boilerplate">
      <Navbar onNavigate={onNavigate} />
      <Flash />
      <main className="boilerplate__main">{children}</main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
