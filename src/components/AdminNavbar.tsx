import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/eldeetech-logo.png";

type Props = {
  showLogout?: boolean;
  onLogout?: () => void;
};

const AdminNavbar = ({ showLogout, onLogout }: Props) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center group">
            <img src={logo} alt="Eldeetech Ltd" className="h-10 transform group-hover:scale-105 transition-transform" />
          </Link>

          {/* Center: Admin Dashboard button */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Button asChild variant="default" className="bg-gradient-primary hover:opacity-90">
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          </div>

          {/* Right: Logout (optional) */}
          <div className="ml-auto">
            {showLogout ? (
              <Button variant="destructive" onClick={onLogout}>Logout</Button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
