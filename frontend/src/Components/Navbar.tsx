import React, { useState, useEffect, useRef, useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { MyContext } from '../Contextapis/Creditiontials.tsx'; // Import context
import axios from "axios";

function Navbar() {
  const { value, setValue } = useContext(MyContext); // Access context to set account_number
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuIconRef = useRef<SVGSVGElement | null>(null);
  const closeIconRef = useRef<SVGSVGElement | null>(null);
  const underlineRefs = useRef<HTMLDivElement[]>([]);

  // Toggle menu state
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Store account number in localStorage when set
  useEffect(() => {
    if (value) {
      localStorage.setItem('account_number', value);
    }
  }, [value]);

  // Fetch account number on component mount or check from localStorage
  useEffect(() => {
    async function fetchData() {
      const storedAccountNumber = localStorage.getItem('account_number');
      if (storedAccountNumber) {
        setValue(storedAccountNumber); // Set account number from localStorage
      } else {
        try {
          const response = await axios.get('http://localhost:5000/entry', {
            withCredentials: true,
          });
          setValue(response.data.accountno || undefined);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
    fetchData();
  }, []);

  // GSAP animation for the mobile menu
  useEffect(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, {
        duration: 0.5,
        height: "auto",
        opacity: 1,
        ease: "power3.inOut",
        display: "block",
      });
      gsap.to(menuIconRef.current, {
        duration: 0.5,
        scale: 0,
        ease: "power3.inOut",
      });
      gsap.to(closeIconRef.current, {
        duration: 0.5,
        scale: 1,
        ease: "power3.inOut",
        rotation: 180,
      });
    } else {
      gsap.to(menuRef.current, {
        duration: 0.5,
        height: 0,
        opacity: 0,
        ease: "power3.inOut",
        display: "none",
      });
      gsap.to(closeIconRef.current, {
        duration: 0.5,
        scale: 0,
        ease: "power3.inOut",
        rotation: -180,
      });
      gsap.to(menuIconRef.current, {
        duration: 0.5,
        scale: 1,
        ease: "power3.inOut",
      });
    }
  }, [menuOpen]);

  // GSAP Animation for Underline to Box Effect
  useEffect(() => {
    underlineRefs.current.forEach((underline) => {
      gsap.set(underline, { 
        width: "0%", 
        borderBottom: "2px solid yellow",
        transition: "none",
      });

      gsap.to(underline, {
        width: menuOpen ? "100%" : "0%",
        duration: 0.5,
        ease: "power1.inOut",
        borderBottom: "2px solid yellow",
        borderTop: menuOpen ? "2px solid yellow" : "none",
        borderLeft: menuOpen ? "2px solid yellow" : "none",
        borderRight: menuOpen ? "2px solid yellow" : "none",
      });
    });
  }, [menuOpen]);

  return (
    <>
      <div className="z-50 justify-between w-screen bg-black/40 h-fit fixed text-white top-0 flex items-center px-4 py-3">
        {/* Bank Name */}
        <div className="m-3 text-lg font-bold">Hanuman Bank</div>

        {/* Menu Items for larger screens */}
        <div className="hidden md:flex m-3">
          <div className="flex gap-6 relative">
            <Link to="/" className="relative group cursor-pointer text-white">
              Home
              <div ref={(el) => el && underlineRefs.current.push(el)} className="underline"></div>
            </Link>
            <Link to="/transactions" className="relative group cursor-pointer text-white">
              Transactions
              <div ref={(el) => el && underlineRefs.current.push(el)} className="underline"></div>
            </Link>
            <Link to="/transaction-history" className="text-white relative group cursor-pointer">
              Transaction History
              <div ref={(el) => el && underlineRefs.current.push(el)} className="underline"></div>
            </Link>
            <Link to="/profile" className="relative group cursor-pointer text-white">
              Profile
              <div ref={(el) => el && underlineRefs.current.push(el)} className="underline"></div>
            </Link>
            <Link to="/loans" className="relative group cursor-pointer text-white">
              Loans
              <div ref={(el) => el && underlineRefs.current.push(el)} className="underline"></div>
            </Link>
            <Link to="/active-services" className="text-white relative group cursor-pointer">
              Active Services
              <div ref={(el) => el && underlineRefs.current.push(el)} className="underline"></div>
            </Link>
          </div>
        </div>

        {/* Login or Account Number based on the logged-in state */}
        {!value ? (
          <div className="m-3 hidden md:block hover:text-yellow-400 transition duration-300">
            <Link to="/Registrations">Login</Link>
          </div>
        ) : (
          <div className="m-3 hidden md:block hover:text-yellow-400 transition duration-300">
            <Link to="/Dashboard">{value}</Link>
          </div>
        )}

        {/* Menu Icon for Mobile */}
        <div className="md:hidden flex items-center">
          {!menuOpen ? (
            <MenuIcon
              ref={menuIconRef}
              onClick={toggleMenu}
              className="cursor-pointer hover:scale-110 transition duration-300"
              fontSize="large"
            />
          ) : (
            <CloseRoundedIcon
              ref={closeIconRef}
              onClick={toggleMenu}
              className="cursor-pointer hover:scale-110 transition duration-300"
              fontSize="large"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu - Toggle visibility based on state */}
      <div
        ref={menuRef}
        className="flex flex-col items-center bg-black/80 text-white absolute top-16 left-0 w-full py-4 md:hidden"
        style={{ height: 0, opacity: 0, display: "none", overflow: "hidden" }}
      >
        <Link to="/" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Home</Link>
        <Link to="/transactions" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Transactions</Link>
        <Link to="/transaction-history" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Transaction History</Link>
        <Link to="/profile" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Profile</Link>
        <Link to="/loans" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Loans</Link>
        <Link to="/active-services" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Active Services</Link>
        {!value && <Link to="/login" className="py-2 hover:text-yellow-400 hover:bg-yellow-200/20 transition duration-300">Login</Link>}
      </div>
    </>
  );
}

export default Navbar;
