import React, { useState, useEffect } from 'react';
import { Github, Twitter, Instagram, Clock, CheckCircle, Target, RefreshCw, Bird, Zap, Layout, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const shuffleText = (text) => text.split('').sort(() => Math.random() - 0.5).join('');

const romanNumerals = {
  12: 'XII', 1: 'I', 2: 'II', 3: 'III', 4: 'IV',
  5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX',
  10: 'X', 11: 'XI'
};

const PomodorifyLandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logoText, setLogoText] = useState("Pomodorify");
  const [secondsProgress, setSecondsProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    const clockTimer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setSecondsProgress(now.getSeconds() + now.getMilliseconds() / 1000);
    }, 16);

    const shuffleInterval = setInterval(() => {
      setLogoText(shuffleText("Pomodorify"));
      setTimeout(() => setLogoText("Pomodorify"), 1000);
    }, 3000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(shuffleInterval);
    };
  }, []);

  const secondAngle = secondsProgress * 6;
  const minuteAngle = currentTime.getMinutes() * 6 + secondAngle / 60;
  const hourAngle = (currentTime.getHours() % 12) * 30 + minuteAngle / 12;

  return (
    <div className="flex flex-col items-center justify-center relative pt-20">
      <motion.div 
        className="relative flex items-center"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <motion.div
          className="w-96 h-96 relative"
          animate={{ x: hovered ? -200 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
            <circle cx="200" cy="200" r="195" fill="none" stroke="black" strokeWidth="10" />
            <circle cx="200" cy="200" r="190" fill="#f0f0f0" className="opacity-90" />
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
              const angle = ((num - 3) * 30) * (Math.PI / 180);
              const x = 200 + 170 * Math.cos(angle);
              const y = 200 + 170 * Math.sin(angle);
              return (
                <text key={num} x={x} y={y} textAnchor="middle" fontSize="20" fill="black" fontWeight="bold" fontFamily="serif">
                  {romanNumerals[num]}
                </text>
              );
            })}
            <line x1="200" y1="200" x2="200" y2="120" stroke="black" strokeWidth="12" transform={`rotate(${hourAngle} 200 200)`} />
            <line x1="200" y1="200" x2="200" y2="80" stroke="black" strokeWidth="8" transform={`rotate(${minuteAngle} 200 200)`} />
            <line x1="200" y1="200" x2="200" y2="50" stroke="red" strokeWidth="4" transform={`rotate(${secondAngle} 200 200)`} />
            <circle cx="200" cy="200" r="10" fill="black" />
          </svg>
        </motion.div>

        <motion.div 
          className="w-80 p-6 bg-white/10 text-gray-200 font-cursive text-lg leading-relaxed border border-gray-500 rounded-lg shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 50 }}
          transition={{ duration: 0.5 }}
        >
          The Pomodorify app enhances your productivity using the Pomodoro technique. It intelligently adapts to your workflow, offering analytics, focus modes, and break optimization to keep you efficient and energized.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PomodorifyLandingPage;
