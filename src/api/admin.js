import axios from 'axios';

export const updateStatus = async (campaignId, status) => {
  const token = localStorage.getItem('token');

  const res = await axios.put(
    `http://localhost:5000/api/admin/campaigns/${campaignId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
