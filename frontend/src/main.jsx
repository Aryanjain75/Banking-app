import React, { StrictMode ,useEffect,useState} from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Registrations } from './Components/Registration';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import ReactDOM from 'react-dom/client';
import { MyProvider } from './Contextapis/Creditiontials';
import { ImagesSliderConnector } from './Components/ImageSliderConnector';
import ThreeDCard from './Components/3d-cardconnector';
import Copywrite from './Components/Copywrite';
import axios from 'axios';
import { UserDashboard } from './Components/UseDashbord';
import UserAccounts from './Components/AdminDashbord';
import ProtectedRoute from './Components/ProtextedRoute'; // Import ProtectedRoute
import Transaction from './Components/Transection.tsx';

function Main() {
  useEffect(()=>{});
  return (
    <>
      <Navbar />
      <Outlet />
      <Copywrite />
    </>
  );
}

function Home() {
  return (
    <>
      <ImagesSliderConnector />
      <ThreeDCard />
    </>
  );
}

function AdminComponent() {
  return (
    <>
      <UserDashboard />
      <UserAccounts />
    </>
  );
}

function LetsCheckout() {
  const [flag, setFlag] = useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/entry', {
          withCredentials: true,
        });
        setFlag(response.data.flag);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  if (flag === null) {
    return <>Loading...</>;
  }

  return flag ? <AdminComponent /> : <><UserDashboard />
  </>;
}

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/Registrations',
        element: <Registrations />,
      },
      {
        path: '/Login',
        element: <Login />,
      },
      {
        path: '/Dashboard',
        element: (
          <ProtectedRoute>
            <LetsCheckout />
          </ProtectedRoute>
        ),
      },
      {
        path: '/transactions',
        element: (
          <ProtectedRoute>
            <Transaction />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyProvider>
      <RouterProvider router={router} />
    </MyProvider>
  </StrictMode>
);
