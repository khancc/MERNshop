import React from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const OrderPopup = ({ status }) => {
  let icon, message, color;

  switch (status) {
    case "processing":
      icon = <FaSpinner className="animate-spin text-blue-500" size={48} />;
      message = "Loading ...";
      color = "text-blue-500";
      break;
    case "success":
      icon = <FaCheckCircle className="text-green-500" size={48} />;
      message = "Order Successfully!";
      color = "text-green-500";
      break;
    case "failed":
      icon = <FaTimesCircle className="text-red-500" size={48} />;
      message = "Delivery Failed!";
      color = "text-red-500";
      break;
    default:
      return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
        {icon}
        <p className={`font-semibold text-lg ${color}`}>{message}</p>
      </div>
    </div>
  );
};

export { OrderPopup };
