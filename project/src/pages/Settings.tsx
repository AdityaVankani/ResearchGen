import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">General</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when processing is complete
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Default Output Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Output Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-generate all formats</Label>
                <p className="text-sm text-muted-foreground">
                  Create all output types when uploading a paper
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High-quality mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use enhanced processing for better results
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}