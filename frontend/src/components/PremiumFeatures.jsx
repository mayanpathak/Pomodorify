import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layout, Code } from "lucide-react";

const PremiumFeatures = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const premiumAddOns = [
    { icon: Zap, title: "Pro Analytics" },
    { icon: Layout, title: "Custom Themes" },
    { icon: Code, title: "API Access" },
  ];

  const popupVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.5,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="mt-16 max-w-4xl w-full mb-24 relative">
      <h3 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
        Premium Features
      </h3>
      <div className="grid grid-cols-3 gap-6">
        {premiumAddOns.map(({ icon: Icon, title }, index) => (
          <motion.div
            key={index}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 text-center hover:border hover:border-emerald-500/50 transition-all cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 2 }}
            onClick={() => setSelectedFeature(title)}
          >
            <Icon
              size={56}
              className="mx-auto mb-4 text-emerald-400 opacity-80"
            />
            <h4 className="text-xl font-semibold text-gray-50">{title}</h4>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedFeature && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-emerald-600/80 to-emerald-800/80 p-10 rounded-3xl text-center shadow-2xl"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-4xl font-bold mb-4 text-white">
                Coming Soon!!!
              </h2>
              <p className="text-xl text-emerald-100 mb-6">
                {selectedFeature} feature is in development
              </p>
              <motion.button
                className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFeature(null)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumFeatures;