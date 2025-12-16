// Main homepage with expression generator

'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ExpressionInput from '@/components/ExpressionInput';
import ExpressionCard from '@/components/ExpressionCard';
import { Save, Check } from 'lucide-react';

export default function HomePage() {
  
  const { user } = useAuth(); // user from auth context
  const [loading, setLoading] = useState(false); // track state if app is generating expressions
  const [results, setResults] = useState(null); // store expressions generated
  const [saved, setSaved] = useState(false); // saved message state

  /**
   * Handle expression generation
   * @param intent - What the user wants to say
   */
  const handleGenerate = async (intent) => {
    setLoading(true); // Show loading spinner
    setSaved(false); // Reset saved status
    setResults(null); // Clear previous results

    try {
      // Call our API route to generate expressions
      const response = await fetch('/api/generate-expressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent }), // Send user's intent
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to generate expressions');
      }

      // Parse the JSON response
      const data = await response.json();
      
      // Save results to state so we can display them
      setResults(data);
    } 
    catch (error) {
      console.error('Error:', error);
      alert('Failed to generate expressions. Please try again.');
    } 
    finally {
      setLoading(false); // Hide loading spinner
    }
  };

  /**
   * Save current results to Firebase for later viewing in history
   */
  const handleSave = async () => {
    // Make sure user is logged in and we have results to save
    if (!user || !results) {
      alert('Please sign in to save expressions');
      return;
    }

    try {
      // Add document to Firestore 'saved-expressions' collection
      await addDoc(collection(db, 'saved-expressions'), {
        userId: user.uid, // Link to current user
        ...results, // Include all expression data
        savedAt: new Date().toISOString(), // Timestamp
      });

      // Show "Saved!" message
      setSaved(true);
      
      // Hide "Saved!" message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save expressions');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero section with title and description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Express Yourself Naturally in Korean
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Describe what you want to say, and get contextual Korean expressions with different formality
            levels, cultural nuances, and pronunciation guides.
          </p>
        </div>

        {/* Input form component */}
        <ExpressionInput onGenerate={handleGenerate} loading={loading} />

        {/* Results section (only shown after generation) */}
        {results && (
          <div className="mt-12">
            {/* Header with "Save All" button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated Expressions</h2>
              
              {/* Only show save button if user is logged in */}
              {user && (
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  {saved ? (
                    // Show checkmark when saved
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">Saved!</span>
                    </>
                  ) : (
                    // Show save icon normally
                    <>
                      <Save className="w-5 h-5" />
                      <span className="font-medium">Save All</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Grid of expression cards (2 columns on large screens) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map through each expression and create a card */}
              {results.expressions.map((expr) => (
                <ExpressionCard key={expr.id} expression={expr} />
              ))}
            </div>
          </div>
        )}

        {/* "Why HanExpress?" section (shown when no results yet) */}
        {!results && !loading && (
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why HanExpress?</h3>
              
              {/* Feature grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Context-Aware</h4>
                  <p className="text-gray-600 text-sm">
                    Get expressions that match your exact intent, not just word-for-word translations
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Audio Pronunciation</h4>
                  <p className="text-gray-600 text-sm">
                    Hear native pronunciation for every expression to improve your speaking
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deep Learning</h4>
                  <p className="text-gray-600 text-sm">
                    Understand vocabulary, grammar, and cultural context behind each expression
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Save & Review</h4>
                  <p className="text-gray-600 text-sm">
                    Build your personal collection of expressions for future practice
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}