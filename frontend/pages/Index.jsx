import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Upload, Video, Download, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.js";

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file);
      setIsProcessed(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('video', uploadedFile);
      
      // Send request to backend
      const response = await fetch('/api/remove-audio', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to process video');
      }
      
      // Create download URL from response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Store download URL in state
      setProcessedUrl(url);
      setIsProcessed(true);
    } catch (error) {
      console.error('Processing error:', error);
      alert('Failed to process video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!uploadedFile || !isProcessed || !processedUrl) return;
    
    // Create download link
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `no-audio-${uploadedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Clean up URL object when component unmounts or processedUrl changes
  useEffect(() => {
    return () => {
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
      }
    };
  }, [processedUrl]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Video Processor</h1>
          <p className="text-lg text-slate-600">Upload, process, and download your video files</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-800">Process Your Video</CardTitle>
            <CardDescription className="text-slate-600">
              Upload a video file to get started with processing
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Upload Video File Size less then 100mb*
              </label>
              
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : uploadedFile
                    ? "border-green-500 bg-green-50"
                    : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center">
                  {uploadedFile ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="text-lg font-medium text-green-700">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-slate-400 mb-4" />
                      <p className="text-lg font-medium text-slate-700">
                        Drop your video file here
                      </p>
                      <p className="text-sm text-slate-500">
                        or click to browse files
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {uploadedFile && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    Change File
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Process Button */}
              <Button
                onClick={handleProcess}
                disabled={!uploadedFile || isProcessing}
                className={cn(
                  "flex-1 h-12 text-base font-medium transition-all duration-200",
                  !uploadedFile || isProcessing
                    ? "bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5 mr-2" />
                    Process Video
                  </>
                )}
              </Button>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={!isProcessed}
                className={cn(
                  "flex-1 h-12 text-base font-medium transition-all duration-200",
                  !isProcessed
                    ? "bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                )}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Processed
              </Button>
            </div>

            {/* Status Messages */}
            {isProcessed && (
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✨ Your video has been successfully processed!
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Click the download button to save your processed file.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-slate-500 text-sm">
          Supports all common video formats: MP4, AVI, MOV, MKV, and more
        </div>
      </div>
    </div>
  );
}
