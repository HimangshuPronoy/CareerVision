
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, Crown, Flame } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const GamificationElements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'skill-master',
      title: 'Skill Master',
      description: 'Reach 80% in any skill',
      icon: Star,
      color: '#fbbf24',
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'career-focused',
      title: 'Career Focused',
      description: 'Complete career assessment',
      icon: Target,
      color: '#8b5cf6',
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'networking-pro',
      title: 'Networking Pro',
      description: 'Build 50+ connections',
      icon: Trophy,
      color: '#06b6d4',
      unlocked: false,
      progress: 32,
      maxProgress: 50
    },
    {
      id: 'speed-learner',
      title: 'Speed Learner',
      description: 'Complete 5 courses this month',
      icon: Zap,
      color: '#10b981',
      unlocked: false,
      progress: 3,
      maxProgress: 5
    }
  ]);

  const [showUnlock, setShowUnlock] = useState<string | null>(null);
  const [streak, setStreak] = useState(7);
  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(12);

  useEffect(() => {
    // Simulate achievement unlock
    const timer = setTimeout(() => {
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === 'skill-master' 
            ? { ...achievement, unlocked: true, progress: 1 }
            : achievement
        )
      );
      setShowUnlock('skill-master');
      setTimeout(() => setShowUnlock(null), 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Achievement Unlock Modal */}
      <AnimatePresence>
        {showUnlock && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              className="relative bg-gradient-to-br from-yellow-500 to-orange-500 p-8 rounded-2xl text-center max-w-sm w-full"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-16 h-16 mx-auto mb-4 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
              <p className="text-xl font-semibold text-yellow-100 mb-2">Skill Master</p>
              <p className="text-yellow-200">You reached 80% in a skill!</p>
              
              {/* Confetti particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI) / 6) * 100,
                    y: Math.sin((i * Math.PI) / 6) * 100,
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Stats */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Crown className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">Level {level}</h3>
              <p className="text-gray-400">Career Explorer</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-500">{xp.toLocaleString()} XP</p>
            <p className="text-gray-400 text-sm">{Math.round((xp % 1000) / 1000 * 100)}% to next level</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(xp % 1000) / 1000 * 100}%` }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Streak Counter */}
        <motion.div
          className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-8 h-8 text-orange-500 mr-3" />
          </motion.div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{streak} Day Streak</p>
            <p className="text-orange-300 text-sm">Keep it up! 🔥</p>
          </div>
        </motion.div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Achievements
          </h3>
          <span className="text-gray-400 text-sm">
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                  : 'bg-gray-800/50 border-gray-600/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-3">
                <motion.div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                    achievement.unlocked ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{ backgroundColor: `${achievement.color}30` }}
                  animate={achievement.unlocked ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 2, repeat: achievement.unlocked ? Infinity : 0, repeatDelay: 3 }}
                >
                  <achievement.icon
                    className="w-5 h-5"
                    style={{ color: achievement.color }}
                  />
                </motion.div>
                <div className="flex-1">
                  <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-gray-500 text-sm">{achievement.description}</p>
                </div>
              </div>

              {!achievement.unlocked && achievement.progress > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: achievement.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              )}

              {achievement.unlocked && (
                <div className="flex items-center text-yellow-500 text-sm font-medium">
                  <Trophy className="w-3 h-3 mr-1" />
                  Unlocked!
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationElements;
