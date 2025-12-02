import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Trash2, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

interface TasksTabProps {
  darkMode: boolean;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function TasksTab({ darkMode, tasks, setTasks }: TasksTabProps) {

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '09:00',
  });

  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const inputBgClass = darkMode
    ? 'bg-slate-700/50 border-slate-600/40'
    : 'bg-white/50 border-white/40';

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
    });
    setShowAddForm(false);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'pending' ? 'completed' : 'pending',
          completedAt: task.status === 'pending' ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue = task.status === 'pending' && new Date(`${task.dueDate}T${task.dueTime}`) < new Date();

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-5 border shadow-lg hover:shadow-xl transition-all ${
          task.status === 'completed' ? 'opacity-75' : ''
        } ${isOverdue ? 'border-red-500/50' : ''}`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => handleToggleComplete(task.id)}
            className="mt-1 flex-shrink-0"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400 hover:text-purple-500 transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={`${textClass} mb-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className={`text-sm ${textSecondaryClass} mb-3`}>{task.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
              <span className={`flex items-center gap-1 text-xs ${textSecondaryClass}`}>
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className={`flex items-center gap-1 text-xs ${textSecondaryClass}`}>
                <Clock className="w-3 h-3" />
                {task.dueTime}
              </span>
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
          </div>

          {task.status === 'completed' && (
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="flex-shrink-0 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl ${textClass} mb-1`}>Task Management</h2>
          <p className={textSecondaryClass}>Create, track, and manage your clinical tasks</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add Task</span>
        </motion.button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
        >
          <h3 className={`${textClass} mb-4`}>Create New Task</h3>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm ${textSecondaryClass} mb-2`}>Task Title *</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                className={`w-full px-4 py-2.5 ${inputBgClass} backdrop-blur-sm border rounded-xl ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
              />
            </div>

            <div>
              <label className={`block text-sm ${textSecondaryClass} mb-2`}>Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Add task description (optional)"
                rows={3}
                className={`w-full px-4 py-3 ${inputBgClass} backdrop-blur-sm border rounded-xl ${textClass} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className={`w-full px-4 py-2.5 ${inputBgClass} backdrop-blur-sm border rounded-xl ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className={`w-full px-4 py-2.5 ${inputBgClass} backdrop-blur-sm border rounded-xl ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                />
              </div>

              <div>
                <label className={`block text-sm ${textSecondaryClass} mb-2`}>Due Time</label>
                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  className={`w-full px-4 py-2.5 ${inputBgClass} backdrop-blur-sm border rounded-xl ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTask}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                Create Task
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddForm(false)}
                className={`px-6 py-3 ${
                  darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } rounded-xl transition-colors font-semibold`}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Circle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Pending Tasks</p>
              <p className={`text-2xl font-bold ${textClass}`}>{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Completed</p>
              <p className={`text-2xl font-bold ${textClass}`}>{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Total Tasks</p>
              <p className={`text-2xl font-bold ${textClass}`}>{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div>
        <h3 className={`text-lg ${textClass} mb-4`}>Pending Tasks ({pendingTasks.length})</h3>
        {pendingTasks.length === 0 ? (
          <div className={`${cardBgClass} backdrop-blur-xl rounded-2xl p-12 border shadow-lg text-center`}>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className={`text-xl ${textClass} mb-2`}>All caught up!</h3>
            <p className={textSecondaryClass}>No pending tasks at the moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className={`text-lg ${textClass} mb-4`}>Completed Tasks ({completedTasks.length})</h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
