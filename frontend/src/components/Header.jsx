import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import Navbar from "./Navbar";
import { MdClose, MdMenu } from "react-icons/md";
import { FaBasketShopping, FaCircleUser } from "react-icons/fa6";
import { FiPackage } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { ShopContext } from "../context/ShopContext";
// import MetaMaskOnboarding from '@metamask/onboarding';

const Header = ({ setShowLogin }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);
  const { getTotalCartAmount, token, setToken } = useContext(ShopContext);

  // const [account, setAccount] = useState(null);
  // const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const onboarding = useRef(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //   onboarding.current = new MetaMaskOnboarding();

  //   if (MetaMaskOnboarding.isMetaMaskInstalled()) {
  //     setIsMetaMaskInstalled(true);
  //     connectWallet();
  //   }
  // }, []);

  //  const connectWallet = async () => {
  //   try {
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     if (accounts.length > 0) {
  //       setAccount(accounts[0]);
  //     }
  //   } catch (err) {
  //     console.error("User rejected wallet connection", err);
  //   }
  // };

  // const installMetaMask = () => {
  //   onboarding.current.startOnboarding();
  // };

  const logout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("walletAddress");
    // localStorage.removeItem("userId");
    setToken("");
    navigate("/");
  };

  
  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
      <div className="max-padd-container">
        <div className="flexBetween py-4 px-4 sm:px-0">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-x-6 lg:gap-x-12">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="h-14 w-14 md:h-16 md:w-16 hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Desktop Navigation */}
            <Navbar
              containerStyles={"hidden md:flex gap-x-6 lg:gap-x-8 medium-15"}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-secondary focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpened ? (
                <MdClose className="h-6 w-6" />
              ) : (
                <MdMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <Navbar
            containerStyles={`${
              menuOpened
                ? "absolute top-full left-0 right-0 bg-white shadow-lg py-6 px-8 space-y-6 md:hidden"
                : "hidden"
            }`}
          />

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-x-6">
            {/* Cart with dot indicator */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-secondary transition-colors"
              aria-label="Shopping cart"
            >
              <FaBasketShopping className="text-2xl" />
              {getTotalCartAmount() > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </Link>

            {/* Auth */}
            {!token ? (
              <button
                onClick={() => setShowLogin(true)}
                className="btn-primary rounded-full px-6 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Sign In
              </button>
            ) : (
              <div className="relative group">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <FaCircleUser className="text-2xl text-gray-700" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div 
                    onClick={() => navigate("/myorders")}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <FiPackage className="mr-3 text-gray-500" />
                    My Orders
                  </div>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div 
                    onClick={logout}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <TbLogout className="mr-3 text-gray-500" />
                    Sign Out
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;