'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useSession } from '@/lib/auth-client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

interface TaskFormProps {
  onTaskAdded: () => void
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (title.length > 200) {
      setError('Title must be 200 characters or less')
      return
    }

    if (!session?.user?.id) {
      setError('Please log in to add tasks')
      return
    }

    setLoading(true)
    try {
      await api.tasks.create(session.user.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      })

      setTitle('')
      setDescription('')
      onTaskAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass border-none shadow-xl shadow-indigo-500/5">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
        Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-sm font-medium">
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
            rows={3}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl transition-all duration-300 outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:text-white"
          />
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 ml-1">
            {description.length} / 1000 characters
          </p>
        </div>

        <Button type="submit" className="w-full sm:w-auto px-10" loading={loading}>
          Create Task
        </Button>
      </form>
    </Card>
  )
}
