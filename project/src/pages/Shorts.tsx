import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload'; // Assuming this is your file upload component
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Download } from 'lucide-react'; // Assuming you're using lucide-react for the download icon

export default function Shorts() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
    setSelectedFile(file);
    setIsReady(false); // Reset ready status when a new file is selected
    setVideoUrl(null); // Reset video URL when a new file is selected
  };

  const handleProcess = async () => {
    if (!selectedFile) return; // Early exit if no file is selected

    setIsProcessing(true);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      // Send a POST request to the backend to process the file
      const response = await fetch('http://127.0.0.1:5000/process_pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Convert the response to a Blob (video file)
        const videoBlob = await response.blob();

        // Create a URL for the video Blob and set it to state
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoUrl);  // Set the video URL for playback

        setIsProcessing(false);
        setIsReady(true);
      } else {
        console.error('Error processing the file');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-[#382D76] dark:text-white">
            Create Short Videos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Transform your research into attention-grabbing short-form videos
          </p>

          {/* File upload component */}
          <FileUpload onFileSelect={handleFileSelect} />

          <div className="space-y-6 mt-8">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || isReady || !selectedFile}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Generate Video'}
            </Button>

            <Button disabled={!isReady} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
          </div>
        </div>

        {/* Video Display Section */}
        {videoUrl && (
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
            <h2 className="text-2xl font-semibold text-[#382D76] dark:text-white mb-4">
              Your Processed Video
            </h2>
            <video controls className="w-full h-auto">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </motion.div>
  );
}
