import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

function BadgeWithConfetti({ title, onEarned }) {
  const [earned, setEarned] = useState(false);

  useEffect(() => {
    setEarned(false); // Reset on title change to allow re-triggering
  }, [title]);

  const handleEarn = () => {
    setEarned(true);
    if (onEarned) onEarned(title);
  };

  const confettiVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const confettiPiece = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 50, opacity: 0, transition: { duration: 2, ease: 'easeOut' } }
  };

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];

  return (
    <div className="flex flex-col items-center justify-center">
      {!earned && (
        <Button
          onClick={handleEarn}
          className="bg-gray-300 text-gray-600 hover:bg-gray-400 cursor-pointer rounded-full px-6 py-2 font-bold shadow-md transition-all sm:p-0.5"
        >
          <Award className="w-4 h-4 mr-2" />
          Earn Badge
        </Button>
      )}
      {earned && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold flex items-center shadow-lg border-2 border-yellow-500 sm:p-0.5"
          >
            <Award className="w-5 h-5 mr-2 text-yellow-600 sm:w-4 sm:h-4" />
            {title}
          </motion.div>

          {/* Confetti Animation */}
          <motion.div
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 pointer-events-none sm:w-20 sm:h-20"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                variants={confettiPiece}
                className={`absolute w-2 h-2 rounded-full ${colors[i % colors.length]} rotate-${(i * 10) % 45}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 20}%`,
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

export default BadgeWithConfetti;
