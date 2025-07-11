import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [comments, setComments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`https://crowd-spark-backend.onrender.com/api/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error('Failed to fetch campaign', err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://crowd-spark-backend.onrender.com/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };

    const fetchUpdates = async () => {
      try {
        const res = await axios.get(`https://crowd-spark-backend.onrender.com/api/updates/${id}`);
        setUpdates(res.data);
      } catch (err) {
        console.error('Failed to fetch updates', err);
      }
    };

    fetchCampaign();
    fetchComments();
    fetchUpdates();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`https://crowd-spark-backend.onrender.com/api/comments/${id}`, {
        text: commentText,
        author: 'Guest', 
      });

      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateMessage.trim()) return;

    try {
      const res = await axios.post(`https://crowd-spark-backend.onrender.com/api/updates/${id}`, {
        title: updateTitle,
        message: updateMessage,
      });

      setUpdates([res.data, ...updates]);
      setUpdateTitle('');
      setUpdateMessage('');
    } catch (err) {
      console.error('Failed to post update', err);
    }
  };

  if (!campaign) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">{campaign.title}</h2>
      <p className="text-gray-600 mb-2">{campaign.description}</p>
      <p className="text-gray-800 mb-4">Goal: ₹{campaign.goal}</p>
      <p>Raised: ₹{campaign.raisedAmount}</p>

      <div className="mt-4 mb-6 flex items-center gap-4">
        <span className="font-semibold text-gray-700">Share this campaign:</span>
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">WhatsApp</button>
        <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded">Twitter</button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded">Email</button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied!');
          }}
        >
          Copy Link
        </button>
      </div>

     
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">Campaign Updates</h3>

        <form onSubmit={handleUpdateSubmit} className="mb-4 flex flex-col gap-2">
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Update title (optional)"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Write an update..."
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
          ></textarea>
          <button type="submit" className="self-end bg-green-600 text-white px-4 py-1 rounded">
            Post Update
          </button>
        </form>

        {updates.length > 0 ? (
          updates.map((u) => (
            <div key={u._id} className="border p-3 rounded mb-3 bg-blue-50">
              <p className="font-bold">{u.title}</p>
              <p>{u.message}</p>
              <p className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No updates yet.</p>
        )}
      </div>

      
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">Comments</h3>

        <form onSubmit={handleCommentSubmit} className="mb-4 flex flex-col gap-2">
          <textarea
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button type="submit" className="self-end bg-blue-600 text-white px-4 py-1 rounded">
            Post Comment
          </button>
        </form>

        {comments.length > 0 ? (
          comments.map((c, idx) => (
            <div key={idx} className="border p-3 rounded mb-2 bg-gray-50">
              <p className="text-sm text-gray-600">{c.author || 'Anonymous'}:</p>
              <p>{c.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
