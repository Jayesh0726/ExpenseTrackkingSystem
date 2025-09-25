import React from 'react'


import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        alt="404 Error"
        className="w-40 h-40 mb-6"
      />
      <h1 className="text-5xl font-bold text-gray-100 mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-6">
        Oops! The page you're looking for doesn't exist 😕
      </p>
      <Link
        to="/"
        className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;



