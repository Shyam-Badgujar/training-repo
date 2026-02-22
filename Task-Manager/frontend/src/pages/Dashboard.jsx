import { useCallback, useMemo, useState } from 'react'
import { ADD_BUTTON, EMPTY_STATE, FILTER_LABELS, FILTER_OPTIONS, FILTER_WRAPPER, HEADER, ICON_WRAPPER, LABEL_CLASS, SELECT_CLASSES, STAT_CARD, STATS, STATS_GRID, TAB_ACTIVE, TAB_BASE, TAB_INACTIVE, TABS_WRAPPER, VALUE_CLASS, WRAPPER } from '../assets/dummy'
import { CalendarIcon, Filter, HomeIcon, Plus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import TaskItems from '../components/TaskItems'
import axios from 'axios'
import TaskModal from '../components/TaskModal'

const API_BASE = 'http://localhost:5000/api/tasks'

function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const { tasks, refreshTasks } = useOutletContext()

  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
    // BUG FIX: was checking t.completed === 'true' (string) instead of boolean true
    completed: tasks.filter(t =>
      t.completed === true || t.completed === 1 ||
      (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length
  }), [tasks])

  const filterTasks = useMemo(() => tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    switch (filter) {
      case 'today':
        return dueDate.toDateString() === today.toDateString()
      // BUG FIX: was dueDate <= today (wrong direction)
      case 'week':
        return dueDate >= today && dueDate <= nextWeek
      case 'high':
      case 'medium':
      case 'low':
        return task.priority?.toLowerCase() === filter
      default:
        return true
    }
  }), [tasks, filter])

  // BUG FIX: was missing auth headers, and taskData.id route was wrong
  const handleTaskSave = useCallback(async (taskData) => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      if (taskData.id) {
        await axios.put(`${API_BASE}/${taskData.id}`, taskData, { headers })
      }
      refreshTasks()
      setShowModal(false)
      setSelectedTask(null)
    } catch (error) {
      console.error("Error Saving Task:", error)
    }
  }, [refreshTasks])

  return (
    <div className={WRAPPER}>
      <div className={HEADER}>
        <div className='min-w-0'>
          <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <HomeIcon className='text-blue-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
            <span className='truncate'>Task Overview</span>
          </h1>
          <p className='text-sm text-gray-500 mt-1 ml-7 truncate'>Manage your tasks efficiently</p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = 'border-blue-100', valueKey, textColor, gradient }) => (
          <div key={key} className={`${STAT_CARD} ${borderColor}`}>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className='w-4 h-4 md:w-5 md:h-5' />
              </div>
              <div className='min-w-0'>
                <p className={`${VALUE_CLASS} ${gradient ? 'text-blue-500' : textColor}`}>{stats[valueKey]}</p>
                <p className={LABEL_CLASS}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='space-y-6'>
        <div className={FILTER_WRAPPER}>
          <div className='flex items-center gap-2 min-w-0'>
            <Filter className='w-5 h-5 text-purple-500 shrink-0' />
            <h2 className='text-base md:text-lg font-semibold text-gray-800 truncate'>
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          {filterTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalendarIcon className='w-8 h-8 text-blue-500' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>No tasks found</h3>
              <p className='text-sm text-gray-500 mb-4'>
                {filter === 'all' ? "Create your first task to get started" : "No tasks match this filter"}
              </p>
              <button onClick={() => setShowModal(true)} className={EMPTY_STATE.btn}>
                Add New Task
              </button>
            </div>
          ) : (
            filterTasks.map(task => (
              <TaskItems
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                // BUG FIX: was calling selectedTask(task) and showModal(true) as functions
                onEdit={() => { setSelectedTask(task); setShowModal(true) }}
              />
            ))
          )}
        </div>

        <div
          onClick={() => setShowModal(true)}
          className='hidden md:flex items-center justify-center p-4 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 bg-blue-50/50 cursor-pointer transition-colors'>
          <Plus className='w-5 h-5 text-blue-500 mr-2' />
          <span className='text-gray-600 font-medium'>Add New Task</span>
        </div>
      </div>

      {/* BUG FIX: prop was taskToEdit (capital E) but component expects tasktoEdit */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => { setShowModal(false); setSelectedTask(null) }}
        tasktoEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  )
}

export default Dashboard