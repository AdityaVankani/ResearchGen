import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download } from 'lucide-react';

const lengthOptions = ['Short (1-2 min)', 'Medium (3-5 min)'];
const toneOptions = ['Fun', 'Formal'];
const languageOptions = ['Portuguese', 'Polish', 'English', 'Italian', 'German', 'Korean', 'Russian', 'Hindi', 'French', 'Japanese', 'Chinese'];

export default function Podcasts() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [length, setLength] = useState(lengthOptions[0]);
  const [tone, setTone] = useState(toneOptions[0]);
  const [language, setLanguage] = useState(languageOptions[2]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null); // Use useRef for the audio element

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsReady(false);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('length', length);
    formData.append('tone', tone);
    formData.append('language', language);
    formData.append('use_advanced_audio', 'true');

    try {
      const response = await fetch('http://localhost:5000/generate_podcast', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.status === 'completed') {
        setAudioUrl(result.audio_url);
        setIsReady(true);
      }
    } catch (error) {
      console.error('Error processing podcast:', error);
    }

    setIsProcessing(false);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16 flex"
    >
      <div className="max-w-2xl w-2/3">
        <h1 className="text-4xl font-bold mb-4 text-[#382D76] dark:text-white">
          Convert to Podcast
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Turn your research into an engaging audio experience
        </p>

        <FileUpload onFileSelect={handleFileSelect} />

        <div className="mt-4">
          <label className="block mb-2">Select Length:</label>
          <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full p-2 border rounded">
            {lengthOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block mb-2">Select Tone:</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border rounded">
            {toneOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block mb-2">Select Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
            {languageOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="space-y-6 mt-8">
          <Button
            onClick={handleProcess}
            disabled={isProcessing || isReady}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Process PDF'}
          </Button>
        </div>
      </div>

      {/* Right section for audio preview */}
      <div className="w-1/3 flex justify-center items-center">
        {isReady && audioUrl && (
          <div className="p-4 border rounded-lg shadow-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Podcast Preview</h2>
            <audio ref={audioRef} className="w-full" controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="flex justify-center gap-4 mt-4">
              <Button size="icon" onClick={togglePlayback}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <a href={audioUrl} download>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Download Audio
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
