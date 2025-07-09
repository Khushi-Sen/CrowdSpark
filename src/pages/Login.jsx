import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login Response:", res.data);

      const user = res.data?.user;

      if (user) {
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', res.data.token || '');
        
        if (email === "admin@example.com" && password === "Admin@123") {
          localStorage.setItem("role", "admin");
          navigate("/admin-dashboard");
        } else {
          localStorage.setItem("role", user.role || "user");
          navigate("/dashboard");
        }

        alert('Login successful');
      } else {
        alert('Login failed: Invalid server response');
      }
    } catch (err) {
      console.error("❌ Login Error:", err);

      if (err.response) {
        alert(`Login failed: ${err.response.data?.message || 'Something went wrong'}`);
      } else if (err.request) {
        alert('Login failed: No response from server. Please check your backend.');
      } else {
        alert('Login failed: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BDDDE4] via-[#FFF1D5] to-[#9EC6F3]">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Login to CrowdSpark
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
