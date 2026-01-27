'use client'

import { useState } from 'react'
import type { Task } from '@/types/task'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface TaskEditModalProps {
  task: Task
  onSave: (taskId: number, title: string, description: string) => Promise<void>
  onClose: () => void
}

export default function TaskEditModal({
  task,
  onSave,
  onClose,
}: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    try {
      await onSave(task.id, title.trim(), description.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="glass bg-white/90 dark:bg-slate-900/90 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-w-md w-full p-8 border border-white/40 dark:border-white/10 animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={200}
            required
          />

          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              maxLength={1000}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl transition-all duration-300 outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:text-white"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="bordered"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="rounded-xl px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
