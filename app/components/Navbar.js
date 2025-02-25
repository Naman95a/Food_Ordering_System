"use client"; // Required for client-side interactions

import { useTheme } from "../context/themeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="p-4 flex justify-between items-center bg-gray-200 dark:bg-gray-800">
      <h1 className="text-xl font-bold dark:text-white">My Website</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded bg-gray-300 dark:bg-gray-700 dark:text-white transition"
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
