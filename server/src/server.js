import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Import all models to ensure they're registered
import "./models/userSchema.js";
import "./models/clientSchema.js";
import "./models/advocateSchema.js";
import "./models/specializationSchema.js";
import "./models/subCategorySchema.js";
import "./models/serviceSchema.js";
import "./models/blogSchema.js";
import "./models/contactUsSchema.js";
import "./models/requestServiceSchema.js";

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware - Order is important!
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  ...process.env.CLIENT_URLS.split(","),
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Body parsing middleware - AFTER CORS
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to database
connectDB();

// Serve static files (uploaded images) - serve from project root uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Import routes
app.use("/api/v1", router);

// Root route
app.get("/", (req, res) => {
  res.send("Brit Bangla Chambers Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
