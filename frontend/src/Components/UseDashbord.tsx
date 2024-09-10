import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MyContext } from '../Contextapis/Creditiontials.tsx'; // Import context

export const UserDashboard: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { value } = useContext(MyContext); // Access context to set account_number

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/account`, {
            withCredentials: true,

        });
        console.log(response);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Get token from cookies
  const getToken = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : '';
  };

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/logout', {
        withCredentials: true
      });
      
      if (response.status === 200) {
        window.location.href = 'http://localhost:5000/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex gap-4">
          <a href="http://localhost:5000/entry" className="text-xl hover:text-gray-400">
            <i className="fa-solid fa-user-pen"></i>
          </a>
          <a href="http://localhost:5000/transaction" className="text-xl hover:text-gray-400">
            <i className="fa-solid fa-landmark"></i>
          </a>
        </div>
        <h1 className="text-2xl font-bold">User Panel</h1>
        <div id="logout" onClick={handleLogout} className="text-xl cursor-pointer hover:text-red-500">
          <i className="fa-solid fa-right-from-bracket"></i>
        </div>
      </nav>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold mt-4"
      >
        User Panel
      </motion.h2>
      <motion.div
        id="user-details"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-4 p-4 bg-white/30 shadow rounded"
      >
        {loading ? (
          <p>Loading...</p>
        ) : userDetails ? (
          <div id={`user-${userDetails.account_number}`} className="space-y-2">
            <div className="user-detail grid grid-cols-2">
              <strong className="block font-medium">Account Name:</strong>
              <span id={`account_name-${userDetails.account_number}`}>{userDetails.account_name}</span>
              <strong className="block font-medium">Account Number:</strong>
              {userDetails.account_number}
              <strong className="block font-medium">Account Type:</strong>
              <span id={`account_type-${userDetails.account_number}`}>{userDetails.account_type}</span>
              <strong className="block font-medium">Balance:</strong>
              <span id={`balance-${userDetails.account_number}`}>{userDetails.balance}</span>
              <strong className="block font-medium">Branch Name:</strong>
              <span id={`branch_name-${userDetails.account_number}`}>{userDetails.branch_name}</span>
              <strong className="block font-medium">Email:</strong>
              <span id={`email-${userDetails.account_number}`}>{userDetails.email}</span>
              <strong className="block font-medium">Status:</strong>
              <span id={`status-${userDetails.account_number}`}>{userDetails.status}</span>
              <strong className="block font-medium">User Status:</strong>
              <span id={`userstatus-${userDetails.account_number}`}>{userDetails.userstatus}</span>
            </div>
          </div>
        ) : (
          <p>No user details available</p>
        )}
      </motion.div>
      <script src="https://kit.fontawesome.com/43a4d58aa7.js" crossOrigin="anonymous"></script>
    </motion.div>
  );
};

