'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data } = await axios.post('http://localhost:5000/auth/login', {
                email,
                password,
            })

            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            document.cookie = `accessToken=${data.accessToken}; path=/`

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-stone-500 mt-1">Log in to your account</p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-stone-900 hover:bg-stone-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-40"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>
                </div>

                <p className="text-sm text-center mt-5 text-stone-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-stone-900 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}