# Audio Remover Project

## Project Overview
This project is a web application that allows users to upload video files, process them to remove audio tracks, and download the processed videos. It leverages FFmpeg compiled to WebAssembly to perform video processing directly in the browser.

## Project Structure
- `frontend/`: Contains the React frontend application source code.
  - `pages/`: React pages including the main video processing page.
  - `components/`: UI components used throughout the app.
  - `lib/`: Utility functions.
- `shared/`: Shared code between frontend and backend (if any).
- `public/`: Static assets like images and manifest files.
- `vite.config.js`: Vite configuration for frontend development server.
- `vite.config.server.js`: Vite configuration for backend server build.
- `package.json`: Project dependencies and scripts.
- `README.md`: Project overview and documentation.

## Technologies Used
- React with Vite as the build tool and development server.
- FFmpeg compiled to WebAssembly (`@ffmpeg/ffmpeg`) for client-side video processing.
- Tailwind CSS for styling.
- Radix UI and Lucide React for UI components and icons.

## Setup Instructions
1. Clone the repository.
2. Install dependencies using your package manager (e.g., `npm install` or `pnpm install`).
3. Run the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:8080`.
5. Upload a video file (less than 100MB), process it to remove audio, and download the processed video.

## What It Does
- Allows users to upload video files via drag-and-drop or file selection.
- Processes the video in the browser to remove the audio track using FFmpeg WebAssembly.
- Provides a download link for the processed video without audio.

## Available Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the frontend and backend for production.
- `npm start`: Starts the production server.

## Notes
- Supports common video formats like MP4, AVI, MOV, MKV.
- File size limit is 100MB for browser safety.

