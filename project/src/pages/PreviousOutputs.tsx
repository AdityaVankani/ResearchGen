import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Presentation, Mic, FileVideo, FileImage, Download, Trash2 } from 'lucide-react';

export default function PreviousOutputs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <h1 className="text-4xl font-bold mb-8">Previous Outputs</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Outputs</h2>
            <Button variant="outline" size="sm">Clear All</Button>
          </div>

          <div className="text-center py-8 text-muted-foreground">
            <p>No outputs generated yet</p>
            <p className="text-sm mt-2">Your generated content will appear here</p>
          </div>

          {/* Example output item (commented out until we have real data)
          <div className="border-t first:border-t-0 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Presentation className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium">Research Paper Title</h3>
                  <p className="text-sm text-muted-foreground">Generated on March 10, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          */}
        </Card>
      </div>
    </motion.div>
  );
}