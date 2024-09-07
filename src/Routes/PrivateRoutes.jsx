import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react'; 
import cookie from 'react-cookies';
import { useState } from 'react';

const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    let fetchJwt = async () => {
      const jwt = cookie.load('jwt');
      setJwt(jwt);
    };

    fetchJwt();
  }, []);

  if (jwt === null) {
    return null;
  }

  if (!jwt) {
    sessionStorage.setItem('prevPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoutes;