/**
 * Main API endpoint that orchestrates the entire flow:
 * 1. Generate Korean expressions (Groq)
 * 2. Extract vocabulary **to be added
 * 3. Look up vocabulary (NAVER Dictionary) **to be added
 * 4. Generate audio (NAVER Clova TTS) **to be added
 */

import { NextResponse } from 'next/server'; // import helper middleware
import { generateExpressionsGroq, extractKeyVocabulary } from '@/lib/groq';

/**
 * POST endpoint to generate Korean expressions with full context (similar to req,res in express)
 * 
 * Flow:
 * 1. User sends English intent
 * 2. Generate 4 Korean expressions at different formality levels (HF)
 * 3. Extract key vocabulary from each expression**
 * 4. Look up vocabulary in NAVER Dictionary**
 * 5. Return complete expressions with vocab, grammar, and context**
 * 
 * Audio is generated on-demand via separate endpoint to save time**
 */
export async function POST(request) {
    try { 
        const { intent } = await request.json(); // similar to req.body in express

        // Validation - similar to res.status(400) in express
        if (!intent || intent.trim().length === 0) {
            return NextResponse.json(
                { error: 'Intent is required' },
                { status: 400 }
            );
        }

        // Checking the intent limit (limit set to 500)
        if (intent.length > 500) {
            return NextResponse.json(
                { error: 'Intent is too long (max 500 characters)' },
                { status: 400 }
            );
        }

        console.log("Generating expressions for:", intent);

        // Step 1: Generate Korean expressions using Hugging Face (no use of NAVER yet)
        const expressions = await generateExpressionsGroq(intent); // call function from HF file

        // empty error handling
        if (!expressions || expressions.length === 0) {
            throw new Error("Failed to generate expressions");
        }

        console.log(`Generated ${expressions.length} expressions`);

        // Return expressions without NAVER vocabulary (to be added)
        return NextResponse.json({
            expressions,
            generatedAt: new Date().toISOString(),
        });

    }
    catch (error) { 
        console.error('API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate expressions',
                details: error.message
            },
            { status : 500 }
        )
    }
}
