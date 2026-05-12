import React, { useState, useEffect } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

const WalletPopup = ({ setShowWallet }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setIsMetaMaskInstalled(true);
    } else {
      const interval = setInterval(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
          setIsMetaMaskInstalled(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    const stored = localStorage.getItem("walletAddress");
    if (stored) {
      setSavedAddress(stored);
    }
  }, []);

  const handleInstall = () => {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
    setIsLoading(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        {savedAddress ? (          
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-green-600">
              Connect successful
            </h2>
            <p className="text-center font-mono break-all mb-4">
              Address Metamask: {savedAddress.slice(0, 6)}...{savedAddress.slice(-4)}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowWallet(false)}
                className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </>
          ):(
            !isMetaMaskInstalled ? (
          <>
            <h2 className="text-xl font-semibold mb-2 text-center">
              Not Installed MetaMask
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              You need to install MetaMask to use wallet payment feature.
            </p>
            {isLoading && (
              <p className="text-sm text-blue-500 text-center mb-3 animate-pulse">
                Opening MetaMask settings page...
              </p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowWallet(false)}
                className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Install MetaMask
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Installed Metamask
            </h2>
            <p className="text-sm text-green-600 text-center mb-4">
              You have installed MetaMask. Close the popup to continue.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowWallet(false)}
                className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </>    
        )      
        )}
      </div>
    </div>
  );
};

export default WalletPopup;
