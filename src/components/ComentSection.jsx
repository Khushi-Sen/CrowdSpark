import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CommentsSection({ campaignId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState('Anonymous'); 
  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://crowd-spark-backend.onrender.com/api/comments/${campaignId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };
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
    alert('Comment post failed');
  }
};

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-blue-800 mb-4">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Post Comment
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="border p-3 rounded shadow-sm">
              <p className="font-semibold text-blue-700">{c.user}</p>
              <p className="text-gray-800">{c.text}</p>
              <p className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
