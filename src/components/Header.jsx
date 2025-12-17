// Navigation header with logo, sign in/out, and history link

'use client';

import { useAuth } from '@/context/AuthContext';
import { Sparkles, History, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link'

export default function Header() {
    // Get authentication data from our context
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <header className="border-b border-gray-200 bg-white">
            {/* Container with max width and padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and app name - clicking redirects to home */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* Logo icon with gradient background */}
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">HanExpress</span>
                    </Link>

                    {/* Right side navigation */}
                    <nav className="flex items-center gap-4">
                        
                        {/* Only show History link if user is logged in */}
                        {user && (
                            <Link 
                            href="/history"
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                            <History className="w-5 h-5" />
                            {/* Hide text on small screens with "hidden sm:inline" */}
                            <span className="hidden sm:inline">History</span>
                            </Link>
                        )}

                        {/* Show different buttons depending on if user is logged in */}
                        {user ? (
                            // User IS logged in - show profile and sign out
                            <div className="flex items-center gap-3">
                            {/* User's name display (hidden on mobile) */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{user.displayName}</span>
                            </div>
                            
                            {/* Sign out button */}
                            <button
                                onClick={signOut} // Call signOut function from context
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                            </div>
                        ) : (
                            // User is NOT logged in - show sign in button
                            <button
                            onClick={signInWithGoogle} // Call signInWithGoogle from context
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}