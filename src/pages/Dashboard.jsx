import { useState, useEffect } from "react";
import axios from 'axios';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(null); // To check user ID
  const role = 'owner'; // Optional: Set from auth if role-based logic is needed

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns");
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns if user is owner
  const myCampaigns = campaigns.filter(
    (c) => c.createdBy === user?.id // only show user's own campaigns
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">Dashboard</h2>

      {role === "owner" ? (
        <div>
          <h3 className="text-xl font-semibold text-blue-800 mb-3">My Campaigns</h3>

          {myCampaigns.length > 0 ? (
            <ul className="space-y-2">
              {myCampaigns.map((c) => (
                <li key={c._id} className="bg-white p-4 shadow rounded">
                  <h4 className="font-bold text-blue-700">{c.title}</h4>
                  <p className="text-gray-700">{c.description}</p>
                  <p className="text-green-700 mt-1">₹{c.goal} goal</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have not created any campaigns yet.</p>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-blue-800">Campaigns You Funded</h3>
          <ul className="mt-3 space-y-2">
            <li className="bg-white p-3 shadow-md rounded">🌳 Save the Trees - ₹500</li>
          </ul>
        </div>
      )}
    </div>
  );
}
