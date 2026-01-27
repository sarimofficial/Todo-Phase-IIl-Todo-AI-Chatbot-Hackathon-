'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Task } from '@/types/task'
import { api } from '@/lib/backend-client'
import { useSession } from '@/lib/auth-client'
import TaskItem from './TaskItem'
import TaskEditModal from './TaskEditModal'
import Button from '../ui/Button'

interface TaskListProps {
  refreshTrigger?: number
  onTasksLoaded?: (tasks: Task[]) => void
}

export default function TaskList({
  refreshTrigger = 0,
  onTasksLoaded,
}: TaskListProps) {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.id) return

    setLoading(true)
    setError('')

    try {
      const fetchedTasks = await api.tasks.list(session.user.id)
      setTasks(fetchedTasks)
      onTasksLoaded?.(fetchedTasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, onTasksLoaded])

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks()
    }
  }, [fetchTasks, refreshTrigger, session?.user?.id])

  const handleToggleComplete = async (taskId: number) => {
    if (!session?.user?.id) return

    try {
      const updatedTask = await api.tasks.toggleComplete(session.user.id, taskId)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleEditSave = async (taskId: number, title: string, description: string) => {
    if (!session?.user?.id) return

    try {
      const updatedTask = await api.tasks.update(session.user.id, taskId, {
        title,
        description: description || undefined,
      })
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
      setEditingTask(null)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async (taskId: number) => {
    if (!session?.user?.id) return

    try {
      await api.tasks.delete(session.user.id, taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Syncing with AI</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto animate-pulse">Your productivity engine is warming up...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-[2rem] text-center animate-shake">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-black">!</div>
        <p className="text-red-700 dark:text-red-400 font-bold mb-4">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchTasks}
          className="rounded-xl px-6"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white dark:bg-slate-900/50 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] transition-all duration-500 hover:border-indigo-200 dark:hover:border-indigo-900/30">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group">
          <svg
            className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic">Zero distractions.</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium">Your task list is crystal clear. Time to start something amazing!</p>
      </div>
    )
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <>
      <div className="space-y-12">
        {pendingTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                In Progress
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-100 dark:from-indigo-900/30 to-transparent"></div>
              <span className="text-[10px] font-bold text-gray-400">{pendingTasks.length} {pendingTasks.length === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em] bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
                Completed
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-green-100 dark:from-green-900/30 to-transparent"></div>
              <span className="text-[10px] font-bold text-gray-400">{completedTasks.length} {completedTasks.length === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <div className="grid gap-4 opacity-75 grayscale-[0.2]">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleEditSave}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  )
}
