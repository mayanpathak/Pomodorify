import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSuggestedTasks, createTaskAsync } from '../redux/taskSlice';
import { Sparkles, Plus, X, Loader, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskSuggestions = () => {
  const dispatch = useDispatch();
  const suggestedTasks = useSelector((state) => state.tasks.suggestedTasks);
  const aiStatus = useSelector((state) => state.tasks.aiStatus);
  const aiError = useSelector((state) => state.tasks.aiError);
  const [isOpen, setIsOpen] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [addedTasks, setAddedTasks] = useState({});
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleGetSuggestions = () => {
    setIsFallback(false);
    setAddedTasks({});
    dispatch(getSuggestedTasks())
      .unwrap()
      .then(result => {
        if (result && result.fallback) {
          setIsFallback(true);
        }
        setIsOpen(true);
      })
      .catch(() => {
        setIsOpen(true);
      });
  };

  const handleAddTask = (suggestion, index) => {
    dispatch(createTaskAsync({
      title: suggestion.title,
      content: suggestion.description,
      pomodoro: suggestion.estimatedPomodoros,
      priority: suggestion.priority,
      category: suggestion.category,
      dueDate: null // User can set this later
    }));
    
    // Mark this task as added
    setAddedTasks(prev => ({
      ...prev,
      [index]: true
    }));
  };

  return (
    <>
      <button
        onClick={handleGetSuggestions}
        className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1"
      >
        <Sparkles size={18} className="animate-pulse" />
        <span>AI Suggestions</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <div className="flex items-center gap-3">
                  <Sparkles size={22} className="text-white animate-pulse" />
                  <h3 className="text-xl font-bold text-white">AI Task Suggestions</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white rounded-full p-1 hover:bg-white/20 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow overflow-y-auto p-6">
                {isFallback && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3"
                  >
                    <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-700 dark:text-amber-300">
                      Using basic suggestions because we couldn't access the AI service. Try again later for personalized suggestions based on your productivity patterns.
                    </p>
                  </motion.div>
                )}

                {aiStatus === 'loading' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="relative">
                      <Loader size={40} className="animate-spin text-emerald-500 mb-4" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={18} className="text-emerald-500 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Generating personalized suggestions</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Analyzing your task history and productivity patterns...</p>
                  </motion.div>
                )}

                {aiStatus === 'failed' && !suggestedTasks.length && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                      <AlertTriangle size={32} className="text-red-500" />
                    </div>
                    <p className="text-red-500 text-lg font-medium mb-2">Failed to get suggestions</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{aiError || "An error occurred while getting suggestions. Please try again."}</p>
                    <button 
                      onClick={handleGetSuggestions}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}

                {aiStatus === 'succeeded' && suggestedTasks.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                      <Sparkles size={32} className="text-blue-500" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-2">No suggestions available yet</p>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Complete more tasks to get personalized suggestions tailored to your productivity patterns.</p>
                  </motion.div>
                )}

                {suggestedTasks.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {suggestedTasks.map((suggestion, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative overflow-hidden border rounded-xl shadow-md hover:shadow-lg transition-all ${
                          addedTasks[index] 
                            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                        }`}
                      >
                        {addedTasks[index] && (
                          <div className="absolute right-3 top-3 flex items-center justify-center w-6 h-6 bg-emerald-500 rounded-full">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                        
                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              suggestion.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                              suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                            }`}>
                              {suggestion.priority}
                            </span>
                            {suggestion.category && (
                              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full">
                                {suggestion.category}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{suggestion.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{suggestion.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <span className="block w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <span className="text-sm font-medium">{suggestion.estimatedPomodoros} pomodoros</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleAddTask(suggestion, index)}
                              disabled={addedTasks[index]}
                              className={`${
                                addedTasks[index]
                                  ? 'bg-emerald-50 text-emerald-500 cursor-default'
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              } px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm`}
                            >
                              {addedTasks[index] ? (
                                <>
                                  <Check size={16} />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={16} />
                                  <span>Add task</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          {suggestion.reasoning && (
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{suggestion.reasoning}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {suggestedTasks.length > 0 && (
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Object.keys(addedTasks).length} of {suggestedTasks.length} tasks added
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskSuggestions; 