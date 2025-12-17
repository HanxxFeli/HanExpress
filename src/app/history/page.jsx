// Page that shows user's saved expressions from Firebase

'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ExpressionCard from '@/components/ExpressionCard';
import { Trash2, Calendar } from 'lucide-react';

export default function HistoryPage() { 
    // Get user authentication status
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [ savedExpressions, setSavedExpressions] = useState([]) // array to store all expressions
    const [loading, setLoading] = useState(true) // loading tracking using state 

    // run useEffect on mount or when user changes
    useEffect(() => { 
        // if not logged in, redirect to homepage 
        if (!authLoading && !user) { 
            router.push('/')
            return
        }

        // if user is logged in, get their history
        if (user) { 
            loadHistory()
        }
    }, [ user, authLoading, router])

    /**
     * Load saved expressions from Firebase for current user
     */
    const loadHistory = async () => { 
        if (!user) return;

        try { 
            // Create query for saved expressions (order by most recent first)
            const q = query(
                collection(db, 'saved-expressions'),
                where('userId', '==', user.uid), // current user's data
                orderBy('savedAt', 'desc') // new to old
            )

            const snapshot = await getDocs(q); // execute query

            // Firestore to Javascript obj
            const data = snapshot.docs.map(doc => ({ 
                id: doc.id, // include doc id to be used for deletion
                ...doc.data(), // spread operator for doc data
            }))

            setSavedExpressions(data) // store payload data to savedExpressions state
        }
        catch (error) { 
            console.error('Error loading history:', error);
        }
        finally { 
            setLoading(false) // loading has been completed
        }
    }

    /**
     * delete a saved expression from Firebase
     * @param {string} id - Document ID to delete
     */
    const handleDelete = async (id) => { 
        // show confirmation 
        if (!confirm('Are you sure you want to delete this set of expressions?')) return;

        try {
            // delete document from firestore 
            await deleteDoc(doc(db, 'saved-expressions', id))

            // remove from state so UI updates
            setSavedExpressions(prev => prev.filter(expression => expression.id !== id)) // if id matches, remove (filter out) else keep and save to state
        } 
        catch (error) { 
            console.error('Error deleting expression:', error)
            alert('Failed to delete expression. Please try again.')
        }
    }

    // show loading animation using tailwind util while checking auth or loading data 
    if (authLoading || loading) { 
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Saved Expressions</h1>

                {/* Show message if no saved expressions else display expressions saved */}
                {savedExpressions.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600 mb-4">No saved expressions yet</p>
                        <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Generate Your First Expression
                        </button>
                    </div>
                    ) : (
                    // Display saved expressions
                    <div className="space-y-8">
                        {/* Loop through each saved expression set */}
                        {savedExpressions.map((saved) => (
                            <div key={saved.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                {/* Header with date and delete button */}
                                <div className="flex items-center justify-between mb-4">
                                    {/* Display when this was saved */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                        {new Date(saved.savedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                        </span>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        onClick={() => handleDelete(saved.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Grid of expression cards */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {saved.expressions.map((expr) => (
                                        <ExpressionCard key={expr.id} expression={expr} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );


}