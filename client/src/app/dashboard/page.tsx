'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Toast from '@/components/Toast'
import TaskModal from '@/components/TaskModal'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Task {
    id: number
    title: string
    description?: string
    status: string
    createdAt: string
}

export default function DashboardPage() {
    const router = useRouter()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [toast, setToast] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [confirmId, setConfirmId] = useState<number | null>(null)

    useEffect(() => {
        fetchTasks()
    }, [page, search, statusFilter])

    async function fetchTasks() {
        setLoading(true)
        try {
            const { data } = await api.get('/tasks', {
                params: {
                    page,
                    q: search || undefined,
                    status: statusFilter || undefined,
                },
            })
            setTasks(data.tasks)
            setTotalPages(data.totalPages)
        } catch {
            showToast('Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }

    async function deleteTask(id: number) {
        try {
            await api.delete(`/tasks/${id}`)
            showToast('Task deleted')
            setConfirmId(null)
            fetchTasks()
        } catch {
            showToast('Failed to delete task')
        }
    }

    async function toggleTask(id: number) {
        try {
            await api.patch(`/tasks/${id}/toggle`)
            fetchTasks()
        } catch {
            showToast('Failed to update task')
        }
    }

    async function handleSaveTask(title: string, description: string) {
        try {
            if (editingTask) {
                await api.patch(`/tasks/${editingTask.id}`, { title, description })
                showToast('Task updated')
            } else {
                await api.post('/tasks', { title, description })
                showToast('Task created')
            }
            setShowModal(false)
            fetchTasks()
        } catch {
            showToast('Failed to save task')
        }
    }

    function handleLogout() {
        localStorage.clear()
        document.cookie = 'accessToken=; path=/; max-age=0'
        router.push('/login')
    }

    function showToast(message: string) {
        setToast(message)
        setTimeout(() => setToast(''), 3000)
    }

    function openAddModal() {
        setEditingTask(null)
        setShowModal(true)
    }

    function openEditModal(task: Task) {
        setEditingTask(task)
        setShowModal(true)
    }

    return (
        <div className="min-h-screen">

            {/* Top nav */}
            <div className="bg-white border-b border-stone-200 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <span className="font-semibold text-stone-900">My Tasks</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-stone-400 hover:text-stone-700 transition"
                    >
                        Log out
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* Controls row */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 bg-white transition"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                        className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400 bg-white transition"
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={openAddModal}
                        className="bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        + Add
                    </button>
                </div>

                {/* Task list */}
                {loading ? (
                    <div className="text-center text-stone-400 py-16 text-sm">Loading...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center text-stone-400 py-16 text-sm">
                        No tasks yet — add one above
                    </div>
                ) : (
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white border border-stone-200 rounded-xl px-4 py-3 flex items-start gap-3 hover:border-stone-300 transition"
                            >
                                {/* Toggle button */}
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${task.status === 'completed'
                                            ? 'bg-stone-900 border-stone-900'
                                            : 'border-stone-300 hover:border-stone-500'
                                        }`}
                                >
                                    {task.status === 'completed' && (
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-stone-400 mt-0.5 truncate">{task.description}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 flex-shrink-0">
                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="text-xs text-stone-400 hover:text-stone-700 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmId(task.id)}
                                        className="text-xs text-stone-400 hover:text-red-500 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="text-sm text-stone-400 hover:text-stone-700 disabled:opacity-30 transition"
                        >
                            ← Prev
                        </button>
                        <span className="text-sm text-stone-400">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="text-sm text-stone-400 hover:text-stone-700 disabled:opacity-30 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Add / edit modal */}
            {showModal && (
                <TaskModal
                    task={editingTask}
                    onSave={handleSaveTask}
                    onClose={() => setShowModal(false)}
                />
            )}

            {/* Delete confirmation dialog */}
            {confirmId !== null && (
                <ConfirmDialog
                    message="Are you sure you want to delete this task?"
                    onConfirm={() => deleteTask(confirmId)}
                    onCancel={() => setConfirmId(null)}
                />
            )}

            {/* Toast */}
            {toast && <Toast message={toast} />}
        </div>
    )
}