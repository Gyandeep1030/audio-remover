import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import os from "os";

// Ensure temp directory exists
const tempDir = path.join(os.tmpdir(), "video-processor");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const handleRemoveAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const inputPath = req.file.path;
    const outputFilename = `no-audio-${Date.now()}-${req.file.originalname}`;
    const outputPath = path.join(tempDir, outputFilename);

    // Process video to remove audio
    ffmpeg(inputPath)
      .noAudio()
      .videoCodec('libx264')
      .on('end', () => {
        // Send processed file
        res.download(outputPath, `no-audio-${req.file.originalname}`, (err) => {
          if (err) {
            console.error("Error sending file:", err);
          }
          // Clean up temporary files
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on('error', (err) => {
        console.error("FFmpeg error:", err);
        // Clean up temporary files
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        res.status(500).json({ error: "Failed to process video" });
      })
      .save(outputPath);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
