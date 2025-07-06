
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  suffix?: string;
  prefix?: string;
}

const RealTimeMetrics = () => {
  const [metricsVisible, setMetricsVisible] = useState(false);

  const metrics: MetricData[] = [
    {
      label: "Career Score",
      value: 87,
      change: 12,
      icon: Target,
      color: "#8b5cf6",
      suffix: "%"
    },
    {
      label: "Market Fit",
      value: 92,
      change: 8,
      icon: TrendingUp,
      color: "#06b6d4",
      suffix: "%"
    },
    {
      label: "Network Score",
      value: 68,
      change: 15,
      icon: Users,
      color: "#10b981",
      suffix: "%"
    },
    {
      label: "Skill Power",
      value: 850,
      change: 120,
      icon: Zap,
      color: "#f59e0b",
      prefix: ""
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setMetricsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={metricsVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            delay: index * 0.2, 
            duration: 0.8,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Background glow effect */}
          <div 
            className="absolute inset-0 opacity-20 blur-xl"
            style={{ background: `radial-gradient(circle at center, ${metric.color}, transparent)` }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <motion.div
                className="p-2 rounded-xl"
                style={{ backgroundColor: `${metric.color}20` }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <metric.icon 
                  className="w-5 h-5" 
                  style={{ color: metric.color }}
                />
              </motion.div>
              
              <motion.div
                className="flex items-center text-green-400 text-sm font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index * 0.2) + 0.5 }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +{metric.change}
              </motion.div>
            </div>

            <motion.h3 
              className="text-gray-300 text-sm font-medium mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index * 0.2) + 0.3 }}
            >
              {metric.label}
            </motion.h3>

            <div className="flex items-baseline">
              <AnimatedNumber
                value={metric.value}
                delay={(index * 0.2) + 0.6}
                className="text-2xl font-bold text-white"
                prefix={metric.prefix}
                suffix={metric.suffix}
              />
            </div>
          </div>

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 opacity-0"
            style={{ borderColor: metric.color }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Animated number counter component
const AnimatedNumber = ({ 
  value, 
  delay, 
  className, 
  prefix = "", 
  suffix = "" 
}: { 
  value: number; 
  delay: number; 
  className?: string;
  prefix?: string;
  suffix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / 2000, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(easeOutQuart * value));

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
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.span 
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default RealTimeMetrics;
