
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressRingProps {
  value: number;
  maxValue: number;
  label: string;
  color: string;
  size?: number;
  showCelebration?: boolean;
}

const AnimatedProgressRing = ({ 
  value, 
  maxValue, 
  label, 
  color, 
  size = 120,
  showCelebration = true 
}: AnimatedProgressRingProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
      if (showCelebration && percentage >= 80) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, percentage, showCelebration]);

  const getGradientId = () => `gradient-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}80`} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            stroke={`url(#${getGradientId()})`}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              delay: 0.3 
            }}
            filter={percentage >= 80 ? "url(#glow)" : undefined}
            className={percentage >= 80 ? "animate-pulse" : ""}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <CountUp end={animatedValue} duration={2} />
            <span className="text-sm text-gray-300">%</span>
          </motion.span>
        </div>

        {/* Celebration particles */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 4) * 60,
                  y: Math.sin((i * Math.PI) / 4) * 60,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      <motion.p 
        className="text-sm text-gray-300 mt-2 text-center font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        {label}
      </motion.p>
    </div>
  );
};

// Count up animation component
const CountUp = ({ end, duration }: { end: number; duration: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <>{count}</>;
};

export default AnimatedProgressRing;
