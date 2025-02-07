import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Presentation, Mic, FileVideo, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo1 from "./logo.png";
const services = [
  {
    title: 'Presentations',
    icon: Presentation,
    description: 'Transform papers into engaging slide decks',
    color: 'bg-blue-500',
    route: '/presentations',
  },
  {
    title: 'Podcasts',
    icon: Mic,
    description: 'Convert research into audio content',
    color: 'bg-green-500',
    route: '/podcasts',
  },
  {
    title: 'Shorts/Reels',
    icon: FileVideo,
    description: 'Create viral-worthy short videos',
    color: 'bg-purple-500',
    route: '/shorts',
  },
  {
    title: 'Comics',
    icon: FileImage,
    description: 'Transform research into visual stories',
    color: 'bg-orange-500',
    route: '/comic',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-[#382D76] dark:to-[#2A1F5D]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <img src={logo1} alt="Logo" className="h-16 w-14rem" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#382D76] to-blue-500 dark:from-white dark:to-blue-300">
            Turn Research into Engaging Content
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate Presentations, Podcasts, Comics & Videos from research papers
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className={`${service.color} absolute inset-0 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
              <Button
                variant="outline"
                className="w-full h-full min-h-[200px] relative rounded-xl border-2 hover:border-[#382D76] dark:hover:border-white flex flex-col items-center justify-center gap-4 p-6"
                onClick={() => navigate(service.route)}
              >
                <service.icon className="w-12 h-12" />
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/about')}
            className="bg-[#382D76] text-white hover:bg-[#382D76]/90 dark:bg-white dark:text-[#382D76] dark:hover:bg-white/90"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </div>
  );
}