
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
    handleLogout: () => void;
}

export default function Navbar({ handleLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      
          <ul className="nav-menu">
            <li className="nav-home">
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => {
                  closeMobileMenu();
                }}
              >
                <HomeIcon />
              </Link>
            </li>
            <li className="nav-workouts">
              <Link
                to="/workouts"
                className="nav-link"
                onClick={() => {
                  closeMobileMenu();
                }}
              >
                <FitnessCenterIcon />
              </Link>
            </li>
            <li className="nav-diet">
              <Link
                to="/diet"
                className="nav-link"
                onClick={() => {
                  closeMobileMenu();
                }}
              >
                <LocalDiningIcon />
              </Link>
            </li>
            <li className="nav-profile">
              <Link
                to="/profile"
                className="nav-link"
                onClick={() => {
                  closeMobileMenu();
                }}
              >
                <AccountCircleIcon />
              </Link>
            </li>
            <li className="nav-logout">
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="logout-button"
              >
                <LogoutIcon />
              </button>
            </li>
          </ul>
        </div>
  );
}