import React from 'react'

import SpotLight from '@/components/ui/spot-light'
import { NavLink } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen relative flex flex-col items-center justify-center overflow-hidden bg-gray-950 p-4 text-center">
      <SpotLight bgcolor={"bg-gray-100"} height={"h-32"} width={"w-32"} blur={"blur-[120px]"} left={"right-[2rem]"} top={"top-[82%]"} translateX={"translate-x-[0%]"} translateY={"translate-y-[0%]"}/>
      
      <img
        src="..//./Images/Error404.png"
        alt="404 Error"
        className="w-28"
      />
      <p className=" text-gray-300 mb-6">
        Oops! The page you're looking for doesn't exist 😕
      </p>
      <NavLink
        to="/"
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 text-sm rounded-full cursor-pointer shadow-md transition"
      >
        Go to Home
      </NavLink>
    </div>
  );
};

export default NotFoundPage;



