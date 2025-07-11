import { useState, useEffect } from "react";
import axios from 'axios';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser?.id) {
      fetchUserCampaigns(storedUser.id);
    }
  }, []);

  const fetchUserCampaigns = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/campaigns/user/${userId}`);
      setCampaigns(res.data);
    } catch (err) {
      console.error("Failed to fetch user's campaigns", err);
    }
  };

const handleDelete = async (campaignId) => {
  try {
    const confirmed = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmed) return;

    const res = await axios.delete(`http://localhost:5000/api/campaigns/${campaignId}`);
    if (res.status === 200) {
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
      // alert("✅ Campaign deleted successfully");
    } else {
      throw new Error("Failed");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("❌ Error deleting campaign");
  }
};



  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">My Dashboard</h2>

      {campaigns.length > 0 ? (
        <ul className="space-y-2">
          {campaigns.map((c) => (
            <li key={c._id} className="bg-white p-4 shadow rounded relative">
              <h4 className="font-bold text-blue-700">{c.title}</h4>
              <p className="text-gray-700">{c.description}</p>
              <p className="text-green-700 mt-1">₹{c.goal} goal</p>

              <button
                onClick={() => handleDelete(c._id)}
                className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full shadow hover:bg-red-200 transition"
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center pt-10">You haven't created any campaigns yet.</p>
      )}
    </div>
  );
}
