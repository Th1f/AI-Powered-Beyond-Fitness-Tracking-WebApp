import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import ChatBox from "./components/ChatBox";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Workout from "./routes/Workout";
import ProfilePage from "./routes/ProfilePage";
import ProfileSetup from "./routes/ProfileSetup";
import Landing from "./routes/Landing";
import SignUp from "./routes/SignUp";
import ProtectedRoute from "./auth/ProtectedRoute";
import Diet from "./routes/Diet";
import { auth } from "./config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";



function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
    
        setIsLoggedIn(true);
        setIsLoading(false);
      } else {
     
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    });

  
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
     
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  if (isLoading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          {isDarkMode ? (
            <SunIcon className="theme-icon" />
          ) : (
            <MoonIcon className="theme-icon" />
          )}
        </button> */}

        {isLoggedIn ? (
          <>
           
            <button
              className={`hamburger-menu ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <div className="nav-button-closed-container">
                  <Navbar handleLogout={handleLogout} />{" "}
                </div>
              ) : (
                <div className="nav-button-open-containter">
                  <Navbar handleLogout={handleLogout} />{" "}
                </div>
              )}
            </button>
            <nav
              className={`
                sidebar 
               `}
              onClick={(e) => {
               
                e.stopPropagation();
              }}
            >
              <div className="sidebar-menu-container ">
                <div className="logo" style={{ padding: 0 }}>
                  <h1>B.</h1>
                </div>
                <Navbar handleLogout={handleLogout} />
              </div>
            </nav>

            {isMobileMenuOpen && (
              <div
                className="mobile-menu-overlay"
                onClick={closeMobileMenu}
              ></div>
            )}
          </>
        ) : null}

        <main className="main-content">
          <Routes>
           
            <Route 
              path="/" 
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <Landing />
              } 
            />
            <Route 
              path="/login" 
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />
              } 
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Workout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diet"
              element={
                <ProtectedRoute>
                  <Diet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-setup"
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <ProfileSetup />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ChatBox />
      </div>
    </Router>
  );
}

export default App;
