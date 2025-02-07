import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import axios from 'axios';

export default function Presentations() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [researchTitle, setResearchTitle] = useState('');
  const [professional, setProfessional] = useState<'1' | '0'>('1'); // "1" = professional, "0" = fun
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
  };

  const handleStyleSelect = (style: 'professional' | 'fun') => {
    setProfessional(style === 'professional' ? '1' : '0');
  };

  const handleGeneratePPT = async () => {
    if (!pdfFile || !researchTitle) {
      alert('Please upload a PDF and enter a research title.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('research_title', researchTitle);
    formData.append('professional', professional);

    try {
      const response = await axios.post('http://127.0.0.1:8080/generate_ppt', formData, {
        responseType: 'blob', // Ensure we receive a file
      });

      // Create a URL for the downloaded PPT file
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = window.URL.createObjectURL(blob);
      setPptUrl(url);
    } catch (error) {
      console.error('Error generating PPT:', error);
      alert('Failed to generate the presentation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16 grid grid-cols-2 gap-8"
    >
      {/* Left Section - Upload and Input */}
      <div className="max-w-lg">
        <h1 className="text-4xl font-bold mb-4 text-[#382D76] dark:text-white">
          Create Engaging Presentations
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Transform your research into captivating slide decks that make an impact.
        </p>

        <input
          type="text"
          placeholder="Enter Research Title"
          value={researchTitle}
          onChange={(e) => setResearchTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        />

        <FileUpload 
          onFileSelect={handleFileSelect}
          onStyleSelect={handleStyleSelect}
          showStyleOptions={true}
        />

        <Button onClick={handleGeneratePPT} className="w-full mt-4" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Presentation'}
        </Button>
      </div>

      {/* Right Section - Download & Preview */}
      <div className="flex flex-col items-center justify-center border-l border-gray-300 pl-8">
        {pptUrl ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Presentation Ready</h2>
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${pptUrl}`}
              className="w-full h-64 border rounded-md"
              title="PPT Preview"
            ></iframe>
            <a href={pptUrl} download="presentation.pptx" className="mt-4 w-full">
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Presentation
              </Button>
            </a>
          </>
        ) : (
          <p className="text-gray-500">Your presentation will appear here once generated.</p>
        )}
      </div>
    </motion.div>
  );
}
