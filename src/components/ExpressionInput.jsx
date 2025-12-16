// The text input form where users describe what they want to say in Korean

'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

// Example prompts to help users understand what to type
const EXAMPLE_PROMPTS = [
  "I want to politely say that I like someone without sounding desperate",
  "How do I casually ask a friend to hang out this weekend?",
  "I need to formally decline an invitation to a work event",
];

/**
 * ExpressionInput Component
 * @param {Function} props.onGenerate - Callback function when user submits
 * @param {boolean} props.loading - Whether generation is in progress
 */
export default function ExpressionInput( {onGenerate, loading} ) { 
    const [intent, setIntent] = useState(''); // store user input in textarea

    // handle form submission
    const handleSubmit = (e) => { 
        e.preventDefault();

        // submit if there is text and not loading
        if (intent.trim() && !loading) { 
            onGenerate(intent) // call parent function
        }
    }

    // handle textarea fill when sample prompt is clicked
    const handleExampleClick = (example) => { 
        setIntent(example);
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Main input card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    
                    {/* Header with icon and title */}
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            What do you want to express?
                        </h2>
                    </div>

                    {/* Textarea for user input */}
                    <textarea
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)} // Update state on change
                        placeholder="Describe your intent in English... (e.g., I want to politely say that I like someone without sounding desperate)"
                        className="w-full min-h-30 p-4 border border-gray-300 rounded-xl resize-none 
                                text-gray-900 placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={500} // Limit to 500 characters
                    />

                    {/* Bottom row with character count and submit button */}
                    <div className="flex justify-between items-center mt-4">
                        {/* Character counter */}
                        <span className="text-sm text-gray-500">
                            {intent.length} / 500 characters
                        </span>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={!intent.trim() || loading} // Disable if empty or loading
                            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                            // Show loading spinner when generating
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating...
                            </>
                            ) : (
                            // Show send icon when ready
                            <>
                                <Send className="w-5 h-5" />
                                Generate Expressions
                            </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Example prompts section */}
                <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                        {/* Map through example prompts and create clickable buttons */}
                        {EXAMPLE_PROMPTS.map((example, idx) => (
                            <button
                            key={idx}
                            type="button" // Not a submit button
                            onClick={() => handleExampleClick(example)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                            >
                            {example}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}