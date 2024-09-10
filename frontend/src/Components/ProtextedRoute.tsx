import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../Contextapis/Creditiontials.tsx";
import axios from "axios";

function ProtectedRoute({ children }) {
  const { value, setValue } = useContext(MyContext);
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean|null>(null); // null indicates loading state

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get('http://localhost:5000/LoggedIn', {
          withCredentials: true,
        });
        if (response.data.flag) {
          setValue(response.data.accountno); // Set account number if logged in
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [setValue]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/Login" />;
}

export default ProtectedRoute;
