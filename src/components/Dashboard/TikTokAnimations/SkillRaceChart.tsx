
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Target } from 'lucide-react';

interface SkillData {
  name: string;
  level: number;
  maxLevel: number;
  color: string;
  icon?: React.ComponentType<any>;
  isNew?: boolean;
}

const SkillRaceChart = () => {
  const [skills, setSkills] = useState<SkillData[]>([
    { name: "JavaScript", level: 0, maxLevel: 85, color: "#f7df1e", icon: Star },
    { name: "React", level: 0, maxLevel: 78, color: "#61dafb", icon: Target },
    { name: "TypeScript", level: 0, maxLevel: 72, color: "#3178c6", icon: Trophy },
    { name: "Node.js", level: 0, maxLevel: 65, color: "#339933" },
    { name: "Python", level: 0, maxLevel: 58, color: "#3776ab", isNew: true },
  ]);

  const [isRacing, setIsRacing] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRacing(true);
      animateSkills();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const animateSkills = () => {
    skills.forEach((skill, index) => {
      setTimeout(() => {
        setSkills(prev => 
          prev.map(s => 
            s.name === skill.name 
              ? { ...s, level: skill.maxLevel }
              : s
          )
        );

        // Show level up animation for high-level skills
        if (skill.maxLevel >= 75) {
          setTimeout(() => {
            setShowLevelUp(skill.name);
            setTimeout(() => setShowLevelUp(null), 2000);
          }, 1500);
        }
      }, index * 300);
    });
  };

  const sortedSkills = [...skills].sort((a, b) => b.level - a.level);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Skill Race
        </h3>
        <motion.button
          className="text-blue-400 text-sm font-medium hover:text-blue-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSkills(prev => prev.map(s => ({ ...s, level: 0 })));
            setTimeout(() => animateSkills(), 300);
          }}
        >
          Race Again
        </motion.button>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {sortedSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold"
                    style={{ backgroundColor: skill.color }}
                    animate={{ 
                      scale: index === 0 ? [1, 1.2, 1] : 1,
                      rotate: index === 0 ? [0, 360] : 0
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: index === 0 ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  >
                    {index + 1}
                  </motion.div>
                  
                  <div className="flex items-center">
                    {skill.icon && (
                      <skill.icon 
                        className="w-4 h-4 mr-2"
                        style={{ color: skill.color }}
                      />
                    )}
                    <span className="text-white font-medium">{skill.name}</span>
                    {skill.isNew && (
                      <motion.span
                        className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        NEW
                      </motion.span>
                    )}
                  </div>
                </div>
                
                <motion.span 
                  className="text-gray-300 font-medium"
                  key={skill.level}
                  initial={{ scale: 1.2, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {skill.level}%
                </motion.span>
              </div>

              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                  transition={{ 
                    duration: 2,
                    delay: isRacing ? index * 0.2 : 0,
                    ease: "easeOut"
                  }}
                />
                
                {/* Glow effect for top performer */}
                {index === 0 && skill.level > 0 && (
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full blur-sm"
                    style={{ 
                      background: `linear-gradient(90deg, ${skill.color}, transparent)`,
                      width: `${(skill.level / skill.maxLevel) * 100}%`
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Level up animation */}
              <AnimatePresence>
                {showLevelUp === skill.name && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 1.2 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      LEVEL UP! 🎉
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trophy for winner */}
      <AnimatePresence>
        {sortedSkills[0]?.level > 0 && (
          <motion.div
            className="flex items-center justify-center mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-white font-bold">
              {sortedSkills[0].name} leads with {sortedSkills[0].level}%!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillRaceChart;
