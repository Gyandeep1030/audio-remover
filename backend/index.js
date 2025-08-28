import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { handleDemo } from "./routes/demo.js";
import { handleRemoveAudio } from "./routes/removeAudio.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files in a temporary directory
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });

  app.get("/api/demo", handleDemo);
  
  // Audio removal route
  app.post("/api/remove-audio", upload.single('video'), handleRemoveAudio);

  return app;
}
