import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle } from 'lucide-react';

function Timeline({ steps }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  }, [steps]);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gray-200 transform -translate-x-1/2 hidden sm:block"></div>

      {steps && steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
          className="mb-8 flex flex-col sm:flex-row items-center justify-between w-full"
        >
          {/* Timeline item - alternates sides on desktop */}
          <div className={`order-1 sm:order-${index % 2 === 0 ? '1' : '3'} sm:w-5/12 w-full ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'} mb-3 sm:mb-0 text-sm sm:text-base`}>
            <h3 className="font-bold text-gray-900">{step.title}</h3>
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm">{step.duration || step.timeframe || 'Duration not specified'}</p>
            <p className="text-gray-700 mt-1 sm:mt-2">{step.description}</p>
          </div>

          {/* Timeline point - always centered */}
          <div className="order-2 sm:w-2/12 w-full flex justify-center relative z-10 mb-3 sm:mb-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 sm:border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg transform -translate-x-1/2 left-1/2 absolute sm:translate-x-0 sm:left-auto sm:relative">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/30" />
            </div>
          </div>

          {/* Empty space for alternating layout on desktop */}
          <div className={`order-3 sm:order-${index % 2 === 0 ? '3' : '1'} sm:w-5/12 w-full hidden sm:block`} />
        </motion.div>
      ))}
    </div>
  );
}

export default Timeline;
