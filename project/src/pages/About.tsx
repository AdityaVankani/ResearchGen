import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6 text-[#382D76] dark:text-white">
              Transform Your Research
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We help researchers communicate their work in engaging and accessible formats.
              From dynamic presentations to captivating podcasts, we're revolutionizing how
              research reaches its audience.
            </p>
            <Card className="p-6 bg-[#382D76] text-white dark:bg-white dark:text-[#382D76]">
              <h3 className="text-xl font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2">
                <li>🎯 Professional Presentations</li>
                <li>🎙️ Engaging Podcasts</li>
                <li>📱 Viral-worthy Shorts</li>
                <li>📚 Storytelling Comics</li>
              </ul>
            </Card>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="Research Visualization"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}