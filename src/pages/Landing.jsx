import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#E0F2FE] to-[#FFFDE7]">
      
   
      <header className="bg-[#9EC6F3] text-white flex justify-between items-center px-6 py-4 shadow-md">
        
        <div className="flex items-center gap-2 text-white font-bold text-2xl">
          
          CrowdSpark
        </div>

       
        <nav className="flex items-center gap-6">
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
          <Link to="/login">
            <button className="bg-white text-black px-4 py-2 rounded hover:scale-105 transition">
              Get Started
            </button>
          </Link>
        </nav>
      </header>

      
      <div className="flex flex-col justify-center items-center text-center px-6 py-12">
        <h1 className="text-7xl font-bold mb-12 text-blue-800">CrowdSpark</h1>
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Igniting Ideas.<br /> Fueling Innovation.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
          A sleek and modern MERN stack crowdfunding platform
        </p>
        <Link
          to="/login"
          className="bg-[#FFF1D5] text-blue-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Get Started
        </Link>
      </div>

      
      <footer className="w-full py-4 px-8 flex justify-between items-center bg-[#FFF1D5] shadow-inner text-sm text-gray-600">
        <span className="font-bold text-lg text-black">© 2025 CrowdSpark</span>
        <span>Empowering Ideas, One Spark at a Time</span>
      </footer>
    </div>
  );
}
