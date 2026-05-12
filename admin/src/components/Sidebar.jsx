import React from "react";
import { BsCardChecklist, BsCardList, BsPlusSquare, BsChat, BsStar, BsWallet } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-indigo-50 to-white border-r border-indigo-100 shadow-[5px_0_15px_rgba(0,0,0,0.02)]">
      <div className="p-6 mb-8">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AdminPro
        </div>
      </div>

      <div className="flex flex-col gap-1 px-4">
        <NavLink
          to={"/add"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-indigo-900 hover:bg-indigo-100 hover:text-indigo-700"
            }`
          }
        >
          <BsPlusSquare className="text-lg" />
          <span className="font-medium">Add Items</span>
        </NavLink>

        <NavLink
          to={"/list"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-indigo-900 hover:bg-indigo-100 hover:text-indigo-700"
            }`
          }
        >
          <BsCardList className="text-lg" />
          <span className="font-medium">List Items</span>
        </NavLink>

        <NavLink
          to={"/orders"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-indigo-900 hover:bg-indigo-100 hover:text-indigo-700"
            }`
          }
        >
          <BsCardChecklist className="text-lg" />
          <span className="font-medium">Orders</span>
        </NavLink>

        <NavLink
          to={"/reviews"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-indigo-900 hover:bg-indigo-100 hover:text-indigo-700"
            }`
          }
        >
          <BsStar className="text-lg" />
          <span className="font-medium">Reviews</span>
        </NavLink>
        
        <NavLink
          to={"/wallet"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-indigo-900 hover:bg-indigo-100 hover:text-indigo-700"
            }`
          }
        >
          <BsWallet className="text-lg" />
          <span className="font-medium">Wallet</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;