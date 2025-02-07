import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Comic() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
    setIsReady(false);
  };

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsReady(true);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-[#382D76] dark:text-white">
          Create Story Comics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Turn your research into engaging visual stories
        </p>

        <FileUpload onFileSelect={handleFileSelect} />

        <div className="space-y-6 mt-8">
          <Button 
            onClick={handleProcess} 
            disabled={isProcessing || isReady}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Generate Comic'}
          </Button>

          <Button disabled={!isReady} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Comic
          </Button>
        </div>
      </div>
    </motion.div>
  );
}