import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { breakdownTask, createTaskAsync } from '../redux/taskSlice';
import { SplitSquareVertical, Plus, X, Loader, AlertTriangle } from 'lucide-react';

const TaskBreakdown = ({ task }) => {
  const dispatch = useDispatch();
  const subtasks = useSelector((state) => state.tasks.subtasks[task._id] || []);
  const aiStatus = useSelector((state) => state.tasks.aiStatus);
  const aiError = useSelector((state) => state.tasks.aiError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const handleBreakdownTask = () => {
    setIsFallback(false);
    dispatch(breakdownTask({
      taskId: task._id,
      taskTitle: task.title,
      taskDescription: task.content,
      estimatedPomodoros: task.pomodoro || 4
    }))
    .unwrap()
    .then(result => {
      if (result && result.fallback) {
        setIsFallback(true);
      }
      setIsModalOpen(true);
    })
    .catch(() => {
      setIsModalOpen(true);
    });
  };

  const handleAddSubtask = (subtask) => {
    dispatch(createTaskAsync({
      title: subtask.title,
      content: subtask.description,
      pomodoro: subtask.estimatedPomodoros,
      priority: task.priority,
      category: task.category,
      parentTaskId: task._id
    }));
  };

  const handleAddAllSubtasks = () => {
    subtasks.forEach(subtask => handleAddSubtask(subtask));
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleBreakdownTask}
        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
        title="Break down this task into smaller subtasks"
      >
        <SplitSquareVertical size={16} />
        <span className="text-sm">Breakdown</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Break Down Task</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-medium text-gray-800">{task.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{task.content}</p>
              <div className="mt-2 text-sm text-gray-500">Estimated: {task.pomodoro} pomodoros</div>
            </div>

            {isFallback && (
              <div className="px-4 pt-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Using basic task breakdown because we couldn't access the AI service. These are generic subtasks based on the task title.
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 flex-grow overflow-y-auto">
              {aiStatus === 'loading' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader size={24} className="animate-spin text-emerald-500 mb-2" />
                  <p className="text-gray-600">Breaking down your task into manageable pieces...</p>
                </div>
              )}

              {aiStatus === 'failed' && !subtasks.length && (
                <div className="text-center py-6">
                  <p className="text-red-500 mb-2">Failed to break down task</p>
                  <p className="text-sm text-gray-500 mb-4">{aiError || "An error occurred during task breakdown"}</p>
                  <button 
                    onClick={handleBreakdownTask}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Try again
                  </button>
                </div>
              )}

              {aiStatus !== 'loading' && subtasks.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-600">No subtasks generated</p>
                </div>
              )}

              {subtasks.length > 0 && (
                <div className="space-y-4">
                  {subtasks.map((subtask, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{index + 1}. {subtask.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{subtask.description}</p>
                        </div>
                        <button
                          onClick={() => handleAddSubtask(subtask)}
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">{subtask.estimatedPomodoros} pomodoros</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {subtasks.length > 0 && (
                <button
                  onClick={handleAddAllSubtasks}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add All Subtasks
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskBreakdown; 