import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei'; // For adding a cube
import axios from 'axios';

// Define the type for the User object
interface User {
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  branch_name: string;
  email: string;
  status: string;
  userstatus: string;
  last_transaction_date: string;
  activated: boolean;
}

const UserAccounts = () => {
  const [users, setUsers] = useState<User[]>([]); // Array to hold user details
  const [error, setError] = useState<string | null>(null);
  const rowRefs = useRef<HTMLTableRowElement[]>([]); // Ref to animate rows

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    // GSAP animation for table rows
    gsap.from(rowRefs.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
    gsap.to(rowRefs.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [users]);

  const apiUrl = 'http://localhost:5000/api/auth/accounts'; // Replace with your actual API endpoint

  // Fetch user details from API
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.data.error) {
        throw new Error('Network response was not ok');
      }

      const data = await response.data;
      console.log(data);

      setUsers(data);
    } catch (error) {
      console.log(error);
      console.error('There was a problem with the fetch operation:', error);
      setError('Failed to fetch user data');
    }
  };

  const getToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  };

  // Show the edit form for a specific user
  const showEditForm = (userId: string) => {
    const form = document.getElementById(`edit-form-${userId}`);
    if (form) {
      form.style.display = 'block';
    }
  };

  // Hide the edit form for a specific user
  const hideEditForm = (userId: string) => {
    const form = document.getElementById(`edit-form-${userId}`);
    if (form) {
      form.style.display = 'none';
    }
  };

  // Save updated user details
  const saveUser = async (userId: string) => {
    const updatedDetails = {
      account_name: (document.getElementById(`edit-account_name-${userId}`) as HTMLInputElement).value,
      account_type: (document.getElementById(`edit-account_type-${userId}`) as HTMLSelectElement).value,
      balance: parseFloat((document.getElementById(`edit-balance-${userId}`) as HTMLInputElement).value),
      branch_name: (document.getElementById(`edit-branch_name-${userId}`) as HTMLInputElement).value,
      email: (document.getElementById(`edit-email-${userId}`) as HTMLInputElement).value,
      status: (document.getElementById(`edit-status-${userId}`) as HTMLSelectElement).value,
      userstatus: (document.getElementById(`edit-userstatus-${userId}`) as HTMLSelectElement).value,
      activated: (document.getElementById(`edit-activate-${userId}`) as HTMLSelectElement).value === 'true',
    };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/account/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updatedDetails),
      });

      if (response.ok) {
        alert('User updated successfully!');
        fetchUserDetails(); // Reload the user details
      } else {
        throw new Error('Update operation failed');
      }
    } catch (error) {
      console.error('There was a problem with the update operation:', error);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/account/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
        });

        if (response.ok) {
          alert('User deleted successfully!');
          fetchUserDetails(); // Reload the user details
        } else {
          throw new Error('Delete operation failed');
        }
      } catch (error) {
        console.error('There was a problem with the delete operation:', error);
      }
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = 'http://localhost:5000/login'; // Redirect to login page
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('There was a problem with the logout operation:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-8">
      

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            User Accounts
          </motion.h1>
          <motion.button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Account Name</th>
                <th className="py-3 px-6 text-left">Account Number</th>
                <th className="py-3 px-6 text-left">Account Type</th>
                <th className="py-3 px-6 text-left">Balance</th>
                <th className="py-3 px-6 text-left">Branch Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">User Status</th>
                <th className="py-3 px-6 text-left">Last Transaction Date</th>
                <th className="py-3 px-6 text-left">Activated</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user, index) => (
                <React.Fragment key={user.account_number}>
                  <tr
                    ref={(el) => (rowRefs.current[index] = el as HTMLTableRowElement)}
                    className="border-b border-gray-200 hover:bg-gray-100 opacity-100"
                  >
                    <td className="py-3 px-6 text-left">{user.account_name}</td>
                    <td className="py-3 px-6 text-left">{user.account_number}</td>
                    <td className="py-3 px-6 text-left">{user.account_type}</td>
                    <td className="py-3 px-6 text-left">{user.balance}</td>
                    <td className="py-3 px-6 text-left">{user.branch_name}</td>
                    <td className="py-3 px-6 text-left">{user.email}</td>
                    <td className="py-3 px-6 text-left">{user.status}</td>
                    <td className="py-3 px-6 text-left">{user.userstatus}</td>
                    <td className="py-3 px-6 text-left">{user.last_transaction_date}</td>
                    <td className="py-3 px-6 text-left">{user.activated ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-6 text-center">
                      <motion.button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => showEditForm(user.account_number)}
                        whileHover={{ scale: 1.05 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600 transition"
                        onClick={() => deleteUser(user.account_number)}
                        whileHover={{ scale: 1.05 }}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default UserAccounts;
