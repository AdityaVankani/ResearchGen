import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileType, FileText } from 'lucide-react';

export default function UploadPaper() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Upload Research Paper</h1>
        
        <Card className="p-8">
          <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
            <Upload className="mx-auto w-16 h-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Drop your file here</h2>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <Button>Select File</Button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Supported Formats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileType className="w-4 h-4" />
                <span>PDF</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>DOC/DOCX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>TXT</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}