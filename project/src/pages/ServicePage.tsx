import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const serviceConfig = {
  presentations: {
    title: 'Presentation Generator',
    description: 'Transform your research paper into engaging slide decks',
    styles: ['Academic', 'Corporate', 'Creative'],
  },
  podcasts: {
    title: 'Podcast Generator',
    description: 'Convert your research into audio content',
    styles: ['Conversational', 'Educational', 'Narrative'],
  },
  videos: {
    title: 'Video Generator',
    description: 'Create explanatory video content from your research',
    styles: ['Animation', 'Whiteboard', 'Documentary'],
  },
  abstracts: {
    title: 'Graphical Abstract Generator',
    description: 'Generate visual summaries of your research',
    styles: ['Minimalist', 'Detailed', 'Infographic'],
  },
};

export default function ServicePage() {
  const { type } = useParams();
  const config = serviceConfig[type as keyof typeof serviceConfig];

  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{config.title}</h1>
          <p className="text-lg text-muted-foreground">{config.description}</p>
        </motion.div>

        <Card className="p-8">
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-md">
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your research paper here, or click to browse
                </p>
              </div>
            </div>

            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4">Select Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {config.styles.map((style) => (
                  <Button
                    key={style}
                    variant="outline"
                    className="h-auto py-4"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            <Button size="lg" className="mt-8">
              Generate Content
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}