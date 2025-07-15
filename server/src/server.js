import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import router from './routes/index.js';
import helmet from 'helmet'

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(helment());
  
app.use(bodyParser.json());

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
