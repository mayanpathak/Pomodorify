import React, { useState, useEffect } from "react";
import {
  Github,
  Twitter,
  Instagram,
  Clock,
  CheckCircle,
  Target,
  RefreshCw,
  Bird,
  Zap,
  Layout,
  Code,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PomodorifyLandingPage from "./LandingPage";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import PremiumFeatures from "../components/PremiumFeatures";

const shuffleText = (text) => {
  const shuffled = text
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  return shuffled;
};

const romanNumerals = {
  12: "XII",
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
};

const LandingPage = () => {
    const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logoText, setLogoText] = useState("Pomodorify");
  const [secondsProgress, setSecondsProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const clockTimer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const currentSeconds = now.getSeconds();
      const currentMilliseconds = now.getMilliseconds();
      setSecondsProgress(currentSeconds + currentMilliseconds / 1000);
    }, 16);

    const shuffleInterval = setInterval(() => {
      setLogoText(shuffleText("Pomodorify"));
      setTimeout(() => setLogoText("Pomodorify"), 1000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(clockTimer);
      clearInterval(shuffleInterval);
    };
  }, []);

  const secondAngle = secondsProgress * 6;
  const minuteAngle = currentTime.getMinutes() * 6 + secondAngle / 60;
  const hourAngle = (currentTime.getHours() % 12) * 30 + minuteAngle / 12;

  const features = [
    {
      icon: Clock,
      title: "Adaptive Time Management",
      description:
        "Intelligent Pomodoro tracking that learns and adapts to your unique work rhythm.",
      color: "text-emerald-400",
    },
    {
      icon: CheckCircle,
      title: "Precision Productivity Insights",
      description:
        "Comprehensive analytics that transform your work habits with data-driven recommendations.",
      color: "text-indigo-400",
    },
    {
      icon: Target,
      title: "Immersive Focus Ecosystem",
      description:
        "Curated ambient soundscapes and visual environments to optimize your concentration.",
      color: "text-purple-400",
    },
    {
      icon: RefreshCw,
      title: "Adaptive Workflow Automation",
      description:
        "Seamless session transitions with AI-powered break optimization and intelligent scheduling.",
      color: "text-rose-400",
    },
  ];

  const premiumAddOns = [
    { icon: Zap, title: "Pro Analytics" },
    { icon: Layout, title: "Custom Themes" },
    { icon: Code, title: "API Access" },
  ];
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 " >
    <div className="min-h-screen relative overflow-hidden text-gray-50 selection:bg-emerald-500/30">
    {/* <main className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 relative z-10">
      <PremiumFeatures />
    </main> */}
      <PomodorifyLandingPage />
      {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-xl"></div> */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center transform transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <motion.div
          className="flex items-center space-x-4 z-10"
          animate={{ opacity: [0.5, 1], x: [-10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Bird size={40} className="text-emerald-400" />
          <h1 className="text-4xl font-bold font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            {logoText}
          </h1>
        </motion.div>
        <div className="space-x-4 z-10">
        {isAuthenticated ? (
        <button
          onClick={() => navigate('/pomo')}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-2xl hover:shadow-emerald-500/50 font-semibold tracking-wide"
        >
          Start Using Pomodorify!
        </button>
      ) : (
        <>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-2xl hover:shadow-emerald-500/50 font-semibold tracking-wide"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border-2 border-emerald-500 text-emerald-400 px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-xl hover:bg-emerald-500/10 font-semibold tracking-wide"
          >
            Login
          </button>
        </>
      )}
        </div>
      </header>

      <main className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 relative z-10">
        {/* <motion.div
          className="mb-12 w-96 h-96 relative"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
            <circle
              cx="200"
              cy="200"
              r="195"
              fill="none"
              stroke="black"
              strokeWidth="10"
            />
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="rgba(30, 64, 175, 0.5)"
              className="opacity-80"
            />

            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
              const angle = (num - 3) * 30 * (Math.PI / 180);
              const x = 200 + 170 * Math.cos(angle);
              const y = 200 + 170 * Math.sin(angle);
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fill="black"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  {romanNumerals[num]}
                </text>
              );
            })}

            <line
              x1="200"
              y1="200"
              x2="200"
              y2="120"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 200 200)`}
            />
            <line
              x1="200"
              y1="200"
              x2="200"
              y2="80"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 200 200)`}
            />
            <line
              x1="200"
              y1="200"
              x2="200"
              y2="50"
              stroke="red"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${secondAngle} 200 200)`}
            />

            <circle cx="200" cy="200" r="10" fill="black" />
          </svg>
        </motion.div> */}

        <h2 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 font-['Poppins']">
          Elevate Your Productivity
        </h2>
        <p className="text-xl mb-8 text-gray-300 font-['Inter'] max-w-3xl leading-relaxed">
          A meticulously crafted productivity platform that transcends
          traditional time management. Pomodorify harnesses advanced algorithms
          and elegant design to transform your work experience into a seamless,
          intelligent journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl">
          {features.map(({ icon: Icon, title, description, color }, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-6 p-6 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 hover:border-emerald-500/50 transition-all transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setActiveSection(index)}
              onHoverEnd={() => setActiveSection(null)}
            >
              <Icon size={48} className={`${color} opacity-80`} />
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-gray-50 mb-2">
                  {title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <main className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 relative z-10">
      <PremiumFeatures />
    </main>
        {/* <div className="mt-16 max-w-4xl w-full mb-24">
  <h3 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
    Premium Features
  </h3>
  <div className="grid grid-cols-3 gap-6">
    {premiumAddOns.map(({ icon: Icon, title }, index) => (
      <motion.div
        key={index}
        className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 text-center hover:border hover:border-emerald-500/50 transition-all"
        whileHover={{ scale: 1.05, rotate: 2 }}
      >
        <Icon
          size={56}
          className="mx-auto mb-4 text-emerald-400 opacity-80"
        />
        <h4 className="text-xl font-semibold text-gray-50">{title}</h4>
      </motion.div>
    ))}
  </div>
</div> */}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-between items-center z-10 mb-4">
  <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 font-semibold text-lg">
    Developed by Mayan Pathak
  </div>
  <div className="flex space-x-4">
    {[
      { Icon: Github, href: "https://github.com/mayanpathak" },
      { Icon: Twitter, href: "https://twitter.com/" },
      { Icon: Instagram, href: "https://instagram.com/" },
    ].map(({ Icon, href }, index) => (
      <motion.a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-600/20 text-emerald-400 p-3 rounded-full hover:bg-emerald-600/40 transition-all"
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        <Icon size={24} />
      </motion.a>
    ))}
  </div>
</footer>
    </div>
    </div>
  );
};

export default LandingPage;

