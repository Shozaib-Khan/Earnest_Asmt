'use client'

import { useState } from 'react'

interface Task {
    id: number
    title: string
    description?: string
}

interface Props {
    task: Task | null
    onSave: (title: string, description: string) => void
    onClose: () => void
}

export default function TaskModal({ task, onSave, onClose }: Props) {
    const [title, setTitle] = useState(task?.title || '')
    const [description, setDescription] = useState(task?.description || '')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return
        onSave(title, description)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-md shadow-xl">

                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold text-stone-900">
                        {task ? 'Edit task' : 'New task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-700 text-xl leading-none transition"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Description
                            <span className="text-stone-400 font-normal ml-1">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Any extra details..."
                            rows={3}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-stone-900 hover:bg-stone-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            {task ? 'Save changes' : 'Add task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}