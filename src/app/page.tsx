'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function HomePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push('/dashboard')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/20 dark:border-gray-800/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              T
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              TodoAI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it works</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 text-sm shadow-md shadow-indigo-500/20">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto relative">
          {/* Background Blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100 dark:border-indigo-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Meet your AI Second Brain
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Organize your life with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                AI Powered
              </span> Todos
            </h1>

            <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The only task manager that understands you. Ask the AI Assistant to manage your list, set reminders, and boost your productivity with natural language github.com/sarimofficial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 py-6 text-lg font-bold shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1">
                  Start for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="bordered" className="w-full sm:w-auto rounded-2xl px-10 py-6 text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview / Image Placeholder */}
          <div className="mt-20 relative px-4">
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4">
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center">
                  <p className="text-indigo-500 font-bold text-2xl mb-2">Modern AI Dashboard</p>
                  <p className="text-gray-500 text-lg">Your tasks and AI Assistant in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-16 underline decoration-indigo-500 decoration-4 underline-offset-8">
            Why Choose TodoAI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl mb-6 mx-auto">
                💬
              </div>
              <h3 className="text-xl font-bold mb-4">Natural Language</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Just say "Add a meeting at 3 PM tomorrow" and our AI handles the rest. No complex forms.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl mb-6 mx-auto">
                🤖
              </div>
              <h3 className="text-xl font-bold mb-4">AI Execution</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI can delete, complete, and update your tasks. It's like having a personal secretary.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400 text-2xl mb-6 mx-auto">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-4">Real-time Sync</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Everything updates instantly. Your AI changes appear on the dashboard without refreshing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>© 2026 TodoAI. Built for productivity by <a href="https://github.com/sarimofficial">Sarimdev</a>.</p>
      </footer>
    </div>
  )
}

