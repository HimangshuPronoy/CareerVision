import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { SkillData } from '@/types/skill';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillRadarChartProps {
  skills: SkillData[];
}

const SkillRadarChart: FC<SkillRadarChartProps> = ({ skills }) => {
  if (skills.length < 3) return null; // need at least 3 points for polygon

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  }, [skills]);

  const data = {
    labels: skills.map((s) => s.name),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map((s) => s.level),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          color: '#6B7280'
        },
        pointLabels: {
          font: {
            size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
            weight: 500 as const,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
    plugins: {
      legend: {
        position: window.innerWidth < 640 ? 'bottom' as const : 'top' as const,
        labels: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        display: false
      },
      tooltip: {
        enabled: true,
        boxPadding: window.innerWidth < 640 ? 4 : 8,
        titleFont: {
          size: window.innerWidth < 640 ? 10 : 12,
        },
        bodyFont: {
          size: window.innerWidth < 640 ? 10 : 12,
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: window.innerWidth < 640 ? 2 : 3,
      },
      point: {
        radius: window.innerWidth < 640 ? 3 : 5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: window.innerWidth < 640 ? 1 : 2,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full h-full px-2 sm:px-4"
    >
      <Radar data={data} options={options} />
    </motion.div>
  );
};

export default SkillRadarChart;
