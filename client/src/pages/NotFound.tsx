import React from 'react'


import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4 text-center">
      <img
        src="..//./Images/Error404.png"
        alt="404 Error"
        className="w-96 h-96"
      />
      <p className="text-xl text-gray-300 mb-6">
        Oops! The page you're looking for doesn't exist 😕
      </p>
      <Link
        to="/"
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;



