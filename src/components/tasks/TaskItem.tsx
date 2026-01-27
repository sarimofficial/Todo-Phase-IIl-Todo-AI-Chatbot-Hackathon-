'use client'

import { useState } from 'react'
import type { Task } from '@/types/task'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: number) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => Promise<void>
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await onToggleComplete(task.id)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete(task.id)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <Card variant="bordered" className={`mb-4 transition-all duration-300 border-2 ${task.completed ? 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/30 hover:shadow-lg hover:shadow-indigo-500/5'}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`
            mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center
            transition-all duration-300 cursor-pointer
            ${task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
            }
            ${loading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-black font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100/50 dark:border-indigo-800/50 uppercase tracking-tighter">
              ID-{task.id}
            </span>
            <h3
              className={`font-bold text-lg leading-tight transition-all duration-300 ${task.completed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900 dark:text-white'
                }`}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              className={`text-sm mt-1 transition-all duration-300 ${task.completed ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={loading}
            className="rounded-xl px-3 py-1.5"
          >
            Edit
          </Button>

          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={loading}
                className="rounded-xl px-3 py-1.5"
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="rounded-xl px-3 py-1.5"
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="text-red-500 hover:text-white hover:bg-red-500 rounded-xl px-3 py-1.5 transition-all"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
