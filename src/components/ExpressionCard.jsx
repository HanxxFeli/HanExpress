// Expressions Card that will display all generated expressions

'use client';

import { useState } from 'react';
import { Volume2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

// Predefined Tailwind styles for each of the 4 levels

const LEVEL_STYLES = { 
    formal: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-600',
    label: 'Formal',
    },
    informal: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'bg-purple-600',
        label: 'Informal',
    },
    'polite-casual': {
        bg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'bg-green-600',
        label: 'Polite Casual',
    },
    slang: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        badge: 'bg-pink-600',
        label: 'Slang',
    },
}

export default function ExpressionCard( {expression} ) { 
    const [showDetails, setShowDetails] = useState(false); // dropdown state
    const [isPlaying, setIsPlaying] = useState(false); // audio for tts

    const style = LEVEL_STYLES[expression.level]

    // temporary placeholder for NAVER Clova TTS 
    const handlePlayAudio = () => { 

    }

    return (
        <div className={`${style.bg} ${style.border} border-2 rounded-2xl p-6 transition-all hover:shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
                <span className={`${style.badge} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {style.label}
                </span>
                
                {/* Audio button */}
                <button
                    onClick={handlePlayAudio}
                    disabled={isPlaying}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                    title="Play pronunciation"
                >
                    {/* Icon animation using lucide-react icon */}
                    <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                </button>
            </div>

            {/* Main Content Block */}
            <div className="space-y-3">
                {/* Korean Expression */}
                <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {expression.korean}
                    </p>
                </div>

                {/* English Translation */}
                <p className="text-gray-800 italic">
                    "{expression.translation}"
                </p>
                
                {/* Context Block */}
                <div className="pt-3 border-t border-gray-300">
                    <div className="flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">{expression.context}</p>
                    </div>
                </div>

                {/* showDetails toggle button */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                    {showDetails ? (
                        <>
                        <ChevronUp className="w-4 h-4" />
                        Hide detailed breakdown
                        </>
                    ) : (
                        <>
                        <ChevronDown className="w-4 h-4" />
                        Show detailed breakdown
                        </>
                    )}
                </button>
                
                {/* Display showDetails div if true else render nothing */}
                {showDetails && (
                    <div className="pt-4 space-y-4 border-t border-gray-300">
                        
                        {/* Grammar points */}
                        {expression.grammarPoints && expression.grammarPoints.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Grammar Points</h4>
                            <ul className="list-disc list-inside space-y-1">
                            {expression.grammarPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-gray-700">{point}</li>
                            ))}
                            </ul>
                        </div>
                        )}

                        {/* Cultural note */}
                        {expression.culturalNote && (
                            <div className="bg-white/70 rounded-lg p-3">
                                <h4 className="font-semibold text-gray-900 mb-1">Cultural Note</h4>
                                <p className="text-sm text-gray-700">{expression.culturalNote}</p>
                            </div>
                        )}

                        {/* Placeholder for vocabulary (will add when NAVER works) */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Coming soon:</strong> Detailed vocabulary with NAVER Dictionary definitions
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}