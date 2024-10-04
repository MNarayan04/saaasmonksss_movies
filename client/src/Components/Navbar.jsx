import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [toggle, setToggle] = useState(false);

    const toggleMenu = () => {
        setToggle(!toggle);
    }
  return (
    <header className="bg-white">
      <div className="flex justify-between bg-gray-200 h-16 max-w-screen-2xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-gray-700 text-xl font-semibold" href="/">
          MOVIECRITIC
        </a>

        <div className="flex items-center gap-4">
          <div className="sm:flex sm:gap-4">
            <Link
              className="block rounded-md bg-white px-5 py-2.5 text-md font-medium text-indigo-500 border-2 border-indigo-500 transition hover:bg-indigo-700 hover:text-white"
              to={"/add-movie"}
            >
              Add new movie
            </Link>

            <Link
              className="block rounded-md bg-indigo-700 px-5 py-2.5 text-md font-medium text-white border-2 border-indigo-500 transition hover:bg-indigo-800 hover:text-white"
              to={"/add-review"}
            >
              Add new review
            </Link>
          </div>

          <button onClick={toggleMenu} className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
         
        </div>
      </div>
    </header>
  );
};

export default Navbar;
