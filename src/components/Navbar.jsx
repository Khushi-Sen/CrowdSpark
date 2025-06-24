import { Link } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaPlusCircle,
  FaUser,
  FaSignInAlt,
} from "react-icons/fa";

const navItems = [
  // { to: "/", icon: <FaHome />, label: "Home" },
  { to: "/explore", icon: <FaCompass />, label: "Explore" },
  { to: "/create", icon: <FaPlusCircle />, label: "Create" },
  { to: "/dashboard", icon: <FaUser />, label: "Dashboard" },
  { to: "/login", icon: <FaSignInAlt />, label: "Login" },
];

export default function Navbar() {
  return (
    <nav className="bg-accent p-4 shadow-md flex justify-between items-center">
      {/* App Logo & Name */}
      <div className="text-blue-900 font-bold text-xl flex items-center space-x-2">
        {/* <img
          src="/logo.png" 
          alt="logo"
          className="w-8 h-8"
        /> */}
        <span>CrowdSpark 💡</span>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="relative group text-blue-900 text-xl hover:text-blue-700 transition"
          >
            {item.icon}
            <span className="absolute bottom-[-2.2rem] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-10">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
