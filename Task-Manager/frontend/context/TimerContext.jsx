import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const TimerContext = createContext(null)

export function TimerProvider({ children }) {
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [times, setTimes] = useState({})       // { taskId: seconds }
  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback((taskId) => {
    // Stop any currently running timer
    clearTimer()
    setActiveTaskId(taskId)

    intervalRef.current = setInterval(() => {
      setTimes(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || 0) + 1
      }))
    }, 1000)
  }, [clearTimer])

  const pauseTimer = useCallback(() => {
    clearTimer()
    setActiveTaskId(null)
  }, [clearTimer])

  const resetTimer = useCallback((taskId) => {
    if (activeTaskId === taskId) {
      clearTimer()
      setActiveTaskId(null)
    }
    setTimes(prev => ({ ...prev, [taskId]: 0 }))
  }, [activeTaskId, clearTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return (
    <TimerContext.Provider value={{ activeTaskId, times, startTimer, pauseTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider')
  return ctx
}