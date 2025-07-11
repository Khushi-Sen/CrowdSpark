
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateCampaign() {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [endDate,     setEndDate]     = useState('');  
  const navigate = useNavigate();

const handleCreate = async (e) => {
  e.preventDefault();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.id) {
    alert("You must be logged in to create a campaign.");
    return;
  }

  const campaign = {
    title,
    goal: Number(goal),
    description,
    category,
    endDate,
    userId: storedUser.id, 
  };

  try {
    const res = await axios.post('https://crowd-spark-backend.onrender.com/api/campaigns', campaign);
    alert(res.data.message || "Campaign created successfully");
    console.log("Saved campaign:", res.data.campaign);
    navigate('/dashboard');
  } catch (err) {
    console.error("Create Campaign Error:", err);
    alert("Failed to create campaign");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary px-4 py-12">
      <div className="bg-white p-8  rounded-2xl shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">📢 Create a New Campaign</h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <input
            type="number"
            placeholder="Goal Amount (₹)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <textarea
            placeholder="Campaign Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Category</option>
            <option value="Tech">Tech</option>
            <option value="Art">Art</option>
            <option value="Social">Social</option>
          </select>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            🚀 Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
}
