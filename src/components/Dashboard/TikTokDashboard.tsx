
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, PlayCircle, Camera } from "lucide-react";
import { 
  AnimatedProgressRing, 
  RealTimeMetrics, 
  SkillRaceChart, 
  GamificationElements 
} from './TikTokAnimations';
import { motion, AnimatePresence } from 'framer-motion';

const TikTokDashboard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setShowShareModal(true);
    }, 5000);
  };

  const hashtagSuggestions = [
    "#CareerGrowth", "#TechSkills", "#ProfessionalDevelopment", 
    "#SkillsProgress", "#CareerGoals", "#LearningJourney"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 max-w-md mx-auto space-y-6">
        {/* Header with recording controls */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CareerVision
            </h1>
            <p className="text-gray-400 text-sm">Your journey to success</p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              className={`p-3 rounded-full transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              onClick={handleStartRecording}
              disabled={isRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? (
                <div className="w-4 h-4 bg-white rounded-sm" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Recording indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Recording...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Rings Section */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Career Progress
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                +12% this week
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <AnimatedProgressRing
                value={87}
                maxValue={100}
                label="Career Score"
                color="#8b5cf6"
                size={100}
              />
              <AnimatedProgressRing
                value={92}
                maxValue={100}
                label="Market Fit"
                color="#06b6d4"
                size={100}
              />
            </div>
          </CardContent>
        </Card>

        {/* Real-time Metrics */}
        <RealTimeMetrics />

        {/* Skill Race Chart */}
        <SkillRaceChart />

        {/* Gamification Elements */}
        <GamificationElements />

        {/* Quick Actions for TikTok */}
        <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30">
          <CardContent className="p-4">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-pink-400" />
              Share Your Journey
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {hashtagSuggestions.map((tag, index) => (
                <motion.button
                  key={tag}
                  className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-xs hover:bg-gray-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Create TikTok
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
            <motion.div
              className="relative bg-gray-800 p-6 rounded-2xl max-w-sm w-full border border-gray-700"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Ready to Share!</h3>
              <p className="text-gray-300 mb-6">Your career progress video is ready for TikTok</p>
              
              <div className="space-y-3">
                <Button className="w-full bg-black text-white hover:bg-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
                  Open TikTok
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowShareModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TikTokDashboard;
