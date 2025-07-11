import axios from 'axios';

export const updateStatus = async (campaignId, status) => {
  const token = localStorage.getItem('token');

  const res = await axios.put(
    `https://crowd-spark-backend.onrender.com/api/admin/campaigns/${campaignId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
