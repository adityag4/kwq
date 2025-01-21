import React from "react";
import Header from "../Header";

const Settings = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
        <p className="text-gray-600">
          This is the settings page. You can add options to update your profile, change preferences, or manage your account here.
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-medium text-gray-800">Profile</p>
              <p className="text-gray-600 text-sm">Update your name, email, and profile picture.</p>
            </li>
            <li className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-medium text-gray-800">Preferences</p>
              <p className="text-gray-600 text-sm">Set your preferred language and notification settings.</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Settings;
