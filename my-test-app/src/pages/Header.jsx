import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Globe, Bell, ChevronDown } from "lucide-react";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/"); // Redirect to the home page
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 cursor-pointer md:hidden" />
          <Link to="/dashboard" className="text-xl font-bold hover:underline">
            LearnBridge
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          <Globe className="h-6 w-6 cursor-pointer" title="Change Language" />
          <Bell className="h-6 w-6 cursor-pointer" title="Notifications" />
          <div className="relative">
            <button
              className="flex items-center gap-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="font-medium">User</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-md z-10">
                <Link
                  to="dashboard/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
