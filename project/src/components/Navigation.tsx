import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import logo1 from './logo.png';
const navItems = [
  { label: 'About', path: '/about' },
  { label: 'Presentations', path: '/presentations' },
  { label: 'Podcasts', path: '/podcasts' },
  { label: 'Shorts/Reel', path: '/shorts' },
  { label: 'Comic/Story', path: '/comic' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#382D76] shadow-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img 
              src={logo1}
              // alt="Logo" 
              className="h-16 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'relative px-3 py-2 text-base font-medium transition-colors',
                  'hover:text-[#382D76] dark:hover:text-white',
                  location.pathname === item.path
                    ? 'text-[#382D76] dark:text-white'
                    : 'text-gray-600 dark:text-gray-300',
                  'group'
                )}
              >
                {item.label}
                <motion.div
                  className={cn(
                    'absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 transition-transform',
                    'group-hover:scale-x-100',
                    'bg-[#382D76] dark:bg-white'
                  )}
                  animate={{
                    scaleX: location.pathname === item.path ? 1 : 0
                  }}
                />
              </button>
            ))}
            {/* <ThemeToggle /> */}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}