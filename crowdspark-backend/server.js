require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');


const authRoutes     = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const commentRoutes  = require('./routes/comments');
const updateRoutes   = require('./routes/updates');

const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');

const app = express();
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://crowd-spark-zeta.vercel.app']     
    : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));

app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/auth',      authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/comments',  commentRoutes);
app.use('/api/updates',   updateRoutes);
app.use('/api/payment', paymentRoutes);

const MONGO_URI = process.env.MONGO_URI;
const PORT      = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is missing in .env');
  process.exit(1);
}


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
