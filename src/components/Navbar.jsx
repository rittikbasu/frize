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
      <BsSun className="hidden h-6 w-6 fill-gray-400 transition dark:block md:hover:fill-orange-400" />
    </button>
  );
}

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 -backdrop-hue-rotate-90 backdrop-blur-sm z-50 px-4 py-2 flex items-center justify-between max-w-5xl xl:mx-auto">
      <div className="flex items-center m-2 flex-grow">
        <div className="text-2xl text-red-400 dark:text-lime-400 font-mono tracking-wider">
          frize
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
