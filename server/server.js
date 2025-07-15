import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './src/config/db.js';
import testRoutes from './src/routes/testRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
app.use('/api', testRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Brit Bangla Chambers Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
