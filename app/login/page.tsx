"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Package, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[400px] w-full bg-white rounded-[32px] shadow-sm p-10">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="flex items-center justify-center h-14 w-14 rounded-[18px] bg-[#1C1C1C] mb-6 shadow-sm">
                        <Package className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-[26px] font-semibold text-gray-900 tracking-tight mb-1.5">Sign in</h2>
                    <p className="text-[15px] text-gray-500">to continue to Estimator</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100/50 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[13px] font-medium text-red-700">{error}</p>
                    </div>
                )}

                {/* Form Section */}
                <form className="space-y-4" onSubmit={handleLogin} action="#" method="POST" autoComplete="off">

                    {/* Email Input (Inner Label Style) */}
                    <div className="relative border border-gray-200 rounded-2xl px-4 pt-2.5 pb-2 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all bg-white">
                        <label htmlFor="email" className="block text-[11px] font-medium text-gray-500 mb-0.5">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 text-base bg-transparent outline-none [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827] caret-gray-900"
                            placeholder=""
                            required
                        />
                    </div>

                    {/* Password Input (Inner Label Style with Absolute Centered Icon) */}
                    <div className="relative border border-gray-200 rounded-2xl px-4 pt-2.5 pb-2 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all bg-white">
                        <label htmlFor="password" className="block text-[11px] font-medium text-gray-500 mb-0.5">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pr-10 border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 text-base bg-transparent outline-none tracking-widest [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827] caret-gray-900"
                            placeholder=""
                            required
                        />
                        {/* Absolute positioning perfectly centers the icon vertically in the field */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-[15px] font-medium text-white bg-[#1C1C1C] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors shadow-sm disabled:opacity-50">
                            {loading ? "Signing in..." : "Continue"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
