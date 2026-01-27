/**
 * Task types for the Todo application.
 */

export interface Task {
  id: number
  user_id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
}

export interface TaskListResponse {
  tasks: Task[]
  count: number
}
