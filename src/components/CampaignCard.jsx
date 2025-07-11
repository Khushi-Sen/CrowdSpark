import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


export default function CampaignCard({ campaign, onDelete }) {
  const navigate = useNavigate();

  const raised = campaign.raisedAmount || 0;
  const goal = campaign.goal || 0;

  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  const daysLeft = campaign.endDate
    ? dayjs(campaign.endDate).diff(dayjs(), 'day')
    : null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-blue-800 mb-1">{campaign.title || "Untitled Campaign"}</h2>

      {campaign.category && (
        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mb-3">
          {campaign.category}
        </span>
      )}

      {campaign.description && (
        <p className="text-gray-700 text-sm mb-4">{campaign.description}</p>
      )}

      <div className="w-full bg-gray-200 h-3 rounded-full mb-2">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mb-1">
        <span className="font-semibold text-green-700">₹{raised}</span> raised of ₹{goal}
      </p>

      {daysLeft != null && (
        <p
          className={`text-sm mb-1 ${
            daysLeft > 0
              ? daysLeft <= 5
                ? 'text-red-600 font-semibold'
                : 'text-gray-500'
              : 'text-gray-400 italic'
          }`}
        >
          {daysLeft > 0
            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
            : '⏱️ Campaign ended'}
        </p>
      )}

      {campaign.createdAt && (
        <p className="text-xs text-gray-400 mb-4">
          Created on {new Date(campaign.createdAt).toLocaleDateString()}
        </p>
      )}

      <div className="flex flex-wrap gap-9 ">
        <Link
          to={`/campaign/${campaign._id}`}
          className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full shadow hover:bg-blue-200 transition"
        >
          📄 View
        </Link>

          {campaign.status === 'approved' && (
          <button
            onClick={() =>
              navigate(`/payment?campaignId=${campaign._id}`)
            }
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:bg-green-700 transition"
          >
            💳 Donate
          </button>
        )}
{/* {onDelete && (
          <button
            onClick={() => onDelete(campaign._id)}
            className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-full shadow hover:bg-red-200 transition"
          >
            🗑️ Delete
          </button>
        )} */}
        
      </div>
    </div>
  );
}
