
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateStatus } from "../api/admin"; 

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/not-authorized");
    }
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/campaigns", {
        params: {
          search: searchTerm,
          status: filterStatus,
        },
      });
      setCampaigns(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    await updateStatus(id, status);
    fetchCampaigns(); 
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <input
        type="text"
        placeholder="🔍 Search campaigns"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded w-full max-w-md mb-4 shadow"
      />

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            ["Total Campaigns", stats.totalCampaigns, "from-indigo-500 to-purple-500"],
            ["Pending", stats.pendingCampaigns, "from-yellow-500 to-orange-400"],
            ["Approved", stats.approvedCampaigns, "from-green-500 to-teal-400"],
            ["Rejected", stats.rejectedCampaigns, "from-red-500 to-pink-400"],
            ["Total Users", stats.totalUsers, "from-blue-400 to-purple-600"],
            ["Contributions", stats.totalContributions ?? "N/A", "from-purple-600 to-pink-500"],
          ].map(([label, value, gradient]) => (
            <div
              key={label}
              className={`p-4 rounded shadow text-white bg-gradient-to-r ${gradient} flex items-center justify-between`}
            >
              <div>
                <h4 className="text-sm font-medium">{label}</h4>
                <p className="text-xl font-bold">{value}</p>
              </div>
              <span className="text-xl opacity-30">📊</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-500 mb-6">Loading stats...</p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded ${
              filterStatus === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-600">No matching campaigns found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded">
          <table className="min-w-full table-auto bg-white border border-gray-200">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Goal ₹</th>
                <th className="px-4 py-2 border">Raised ₹</th>
                <th className="px-4 py-2 border">Creator</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp._id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2 border font-semibold">{camp.title || "Untitled"}</td>
                  <td className="px-4 py-2 border capitalize">{camp.category || "None"}</td>
                  <td className="px-4 py-2 border text-green-600 font-semibold">₹{camp.goal}</td>
                  <td className="px-4 py-2 border text-green-700 font-semibold">₹{camp.raisedAmount || 0}</td>
                  <td className="px-4 py-2 border">
                    {camp.creator
                      ? typeof camp.creator === 'object'
                        ? camp.creator.email
                        : camp.creator
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs capitalize ${
                        camp.status?.toLowerCase() === "approved"
                          ? "bg-green-600"
                          : camp.status?.toLowerCase() === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {camp.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {camp.status?.toLowerCase() === "pending" ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(camp._id, "approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(camp._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                          <button
                        onClick={() => navigate(`/campaign/${camp._id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                        
                      </div>
                    ) : (
                      <span className="italic text-gray-400">No Action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
