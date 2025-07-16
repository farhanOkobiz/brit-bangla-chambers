import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/index.js';
import  path  from 'path';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser());


// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
app.use('/api/v1',router)

// Root route
app.get('/', (req, res) => {
  res.send('Brit Bangla Chambers Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
