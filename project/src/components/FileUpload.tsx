import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onStyleSelect?: (style: 'professional' | 'fun') => void;
  showStyleOptions?: boolean;
}

export function FileUpload({ onFileSelect, onStyleSelect, showStyleOptions }: FileUploadProps) {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<'professional' | 'fun'>('professional');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setProgress(0);
    setIsUploaded(false);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploaded(true);
          onFileSelect(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          'p-8 transition-colors',
          isDragging ? 'border-[#382D76] dark:border-white' : ''
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto w-12 h-12 mb-4 text-[#382D76] dark:text-white" />
          <h3 className="text-lg font-semibold mb-2">Drop your PDF here</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to select from your computer
          </p>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            id="file-upload"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Select File
          </Button>
        </div>
      </Card>

      {progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          {isUploaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-600 dark:text-green-400"
            >
              <Check className="w-4 h-4" />
              <span>File uploaded successfully!</span>
            </motion.div>
          )}
        </div>
      )}

      {showStyleOptions && isUploaded && (
        <div className="space-y-4">
          <h4 className="font-medium">Select Style</h4>
          <div className="flex gap-4">
            <Button
              variant={selectedStyle === 'professional' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedStyle('professional');
                onStyleSelect?.('professional');
              }}
            >
              Professional
            </Button>
            <Button
              variant={selectedStyle === 'fun' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedStyle('fun');
                onStyleSelect?.('fun');
              }}
            >
              Fun
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}