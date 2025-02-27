
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { verifyTokenWithBackend } from './backendAuth';
import Loading from '../routes/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
       
        const user = auth.currentUser;
        if (!user) {
          setIsAuthenticated(false);
          return;
        }


        const backendResult = await verifyTokenWithBackend();
        setIsAuthenticated(backendResult.status === 'success');
      } catch (error) {
        console.error('Authentication check failed', error);
        setIsAuthenticated(false);
      }
    };


    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuthentication();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [location.pathname]);


  if (isAuthenticated === null) {
    return <Loading />;
  }


  if (isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;