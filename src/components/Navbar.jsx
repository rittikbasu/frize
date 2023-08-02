import { useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

function ModeToggle() {
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("[&_*]:!transition-none");
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }

  function toggleMode() {
    disableTransitionsTemporarily();

    let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let isSystemDarkMode = darkModeMediaQuery.matches;
    let isDarkMode = document.documentElement.classList.toggle("dark");

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode;
    }
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="group outline-none"
      onClick={toggleMode}
    >
      <BsMoon className="h-[1.3rem] w-[1.3rem] fill-zinc-500 transition dark:hidden md:hover:fill-lime-400" />
      <BsSun className="hidden h-6 w-6 fill-lime-400 transition dark:block md:hover:fill-lime-600" />
    </button>
  );
}

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 px-4 py-2 backdrop-blur flex items-center justify-between m-2 max-w-5xl xl:mx-auto">
      <div className="flex items-center flex-grow">
        <div className="text-2xl text-green-400 dark:text-lime-400 tracking-wider">
          frize
        </div>
        <div className="bg-gray-100 dark:bg-zinc-700 rounded-2xl py-1 px-4 mx-4 lg:mx-32 flex-grow">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
