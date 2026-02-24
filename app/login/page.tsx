"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-white md:bg-[#F5F7FA] flex items-center justify-center p-4 font-sans selection:bg-gray-200">
            <div className="w-full max-w-[400px] bg-white md:rounded-[2rem] p-4 md:p-[40px] md:shadow-[0_8px_40px_rgba(0,0,0,0.04)] md:border md:border-gray-100/80">

                {/* Apple/Google Style Header */}
                <div className="flex flex-col items-center mb-10 pt-4 md:pt-0">
                    <div className="w-12 h-12 bg-[#212121] text-white rounded-[14px] flex items-center justify-center mb-5 shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    </div>
                    <h1 className="text-[24px] font-medium text-gray-900 tracking-tight mb-2">
                        Sign in
                    </h1>
                    <p className="text-[15px] text-gray-500">
                        to continue to Estimator
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100/50 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[13px] font-medium text-red-700">{error}</p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Unified Email Field */}
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=""
                            className="w-full bg-transparent border-none outline-none text-[14px] text-gray-900 placeholder:text-gray-300 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]"
                            required
                        />
                    </div>

                    {/* Unified Password Field */}
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all relative">
                        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">
                            Password
                        </label>
                        <div className="flex items-center w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=""
                                className="w-full bg-transparent border-none outline-none text-[14px] text-gray-900 placeholder:text-gray-300 pr-12 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors flex items-center justify-center bg-white"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-.722-3.25" /><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /><path d="m2 2 20 20" /></svg>
                            )}
                        </button>
                    </div>

                    {/* Pill Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#212121] hover:bg-black text-white rounded-2xl text-[16px] font-medium transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Continue"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
