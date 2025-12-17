/**
 * Groq API handler file that will generate the necessary text from user prompt 
 * Decided to use Groq instead since HuggingFace Inference failed and OpenAI is paid
 */

import Groq from "groq-sdk"

// create Groq client using API token
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate Korean expressions using Groq
 * @param {string} intent - What the user wants to say in English
 * @returns {Promise<Array>} Array of Korean expressions with different formality levels
 */
export async function generateExpressionsGroq(intent) {
    try {
        console.log("Calling Groq API...");

        const completion = await groq.chat.completions.create({
        messages: [
            {
            role: "system",
            content: "You are a Korean language expert. You respond ONLY with valid JSON, no other text, no markdown code blocks, no explanations."
            },
            {
            role: "user",
            content: `Generate 4 Korean translations for: "${intent}"

                Return this exact JSON format with NO markdown, NO code blocks, just pure JSON:
                {
                    "expressions": [
                        {
                            "level": "formal",
                            "korean": "한국어 formal version",
                            "translation": "English translation",
                            "context": "When to use this (e.g., business meetings, formal speeches)",
                            "grammarPoints": ["Key grammar point 1", "Key grammar point 2"],
                            "culturalNote": "Cultural context about formality"
                        },
                        {
                            "level": "informal",
                            "korean": "한국어 informal version",
                            "translation": "English translation",
                            "context": "When to use this (e.g., close friends, family)",
                            "grammarPoints": ["Key grammar point 1", "Key grammar point 2"],
                            "culturalNote": "Cultural context about informal speech"
                        },
                        {
                            "level": "polite-casual",
                            "korean": "한국어 polite-casual version",
                            "translation": "English translation",
                            "context": "When to use this (e.g., everyday situations, acquaintances)",
                            "grammarPoints": ["Key grammar point 1", "Key grammar point 2"],
                            "culturalNote": "Cultural context about polite casual speech"
                        },
                        {
                            "level": "slang",
                            "korean": "한국어 slang version",
                            "translation": "English translation",
                            "context": "When to use this (e.g., texting with close friends, internet)",
                            "grammarPoints": ["Key grammar point 1", "Key grammar point 2"],
                            "culturalNote": "Cultural context about slang usage"
                        }
                    ]
                }

                IMPORTANT: Return ONLY the JSON object, nothing else.`
            }
        ],
            model: "llama-3.3-70b-versatile", // decided to use whatever what available but also reliable
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 0.9,
        });

        // store content payload into generatedText
        const generatedText = completion.choices[0].message.content
        console.log("Groq response received")

        // Parse the response
        const expressions = parseExpressions(generatedText, intent)

        if (expressions && expressions.length > 0) {
            console.log(`Successfully generated ${expressions.length} expressions`)
            return expressions
        } else {
            throw new Error("No valid expressions generated")
        }

    }
    catch (error) {
        console.error("Groq generation error:", error.message)
        
        // Fallback - return basic expression so app doesn't crash
        return generateFallbackExpressions(intent)
    }
}

/**
 * Helper function to parse expressions from model response
 */
function parseExpressions(text, intent) {
    try {
        // Remove markdown code blocks if present
        let cleaned = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        // Try to extract and fix common JSON issues from payload formatting
        // Find the main JSON object
        let jsonMatch = cleaned.match(/\{[\s\S]*"expressions"[\s\S]*\]/);
        
        if (!jsonMatch) {
            console.log("No JSON found in response");
            throw new Error("No JSON found");
        }

        let jsonStr = jsonMatch[0];
        
        // Add closing brace if missing
        if (!jsonStr.trim().endsWith('}')) {
            jsonStr += '\n}';
        }

        // Fix common JSON issues using regex
        jsonStr = jsonStr
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/\n/g, ' ') // Remove newlines that might break parsing
            .replace(/\s+/g, ' '); // Normalize whitespace

        console.log("Attempting to parse JSON...");
        const parsed = JSON.parse(jsonStr);
        const expressions = parsed.expressions || [];

        if (expressions.length === 0) {
            throw new Error("Empty expressions array");
        }

        console.log(`Successfully parsed ${expressions.length} expressions`);

        // Add IDs and ensure all fields exist
        return expressions.map((expr, idx) => ({
            id: `expr-${Date.now()}-${idx}`,
            level: expr.level || 'formal',
            korean: expr.korean || '한국어',
            translation: expr.translation || intent,
            context: expr.context || 'Context not provided',
            grammarPoints: Array.isArray(expr.grammarPoints) 
                ? expr.grammarPoints 
                : ['Grammar information not available'],
            culturalNote: expr.culturalNote || 'Cultural context not provided',
            vocabulary: [], // Will be populated by NAVER Dictionary API
        }));

    } 
    catch (error) {
        console.error("Parse error:", error.message)
        return generateFallbackExpressions(intent)
    }
}

/**
 * Fallback function if Groq API fails
 * Returns basic expressions so app doesn't crash
 */
function generateFallbackExpressions(intent) {
    console.log("Using fallback expressions")

    return [
        {
            id: `expr-${Date.now()}-0`,
            level: "formal",
            korean: "죄송합니다, 서비스 오류가 발생했습니다",
            translation: "I apologize, a service error has occurred",
            context: "Formal announcement",
            grammarPoints: ["Formal ending -습니다", "Apology form 죄송합니다"],
            culturalNote: "This is a very formal way to apologize and announce an error",
            vocabulary: [],
        },
        {
            id: `expr-${Date.now()}-1`,
            level: "informal",
            korean: "지금 안 돼",
            translation: "It's not working right now",
            context: "Informal explanation to close friends or family",
            grammarPoints: ["Informal ending without -요", "Short negative 안 되다"],
            culturalNote: "Used with very close friends or people younger than you",
            vocabulary: [],
        },
        {
            id: `expr-${Date.now()}-2`,
            level: "polite-casual",
            korean: "지금은 서비스를 사용할 수 없어요",
            translation: "The service is unavailable right now",
            context: "Polite casual explanation in everyday situations",
            grammarPoints: ["Polite ending -요", "Negative potential form -을 수 없다"],
            culturalNote: "Most commonly used polite form for everyday conversations",
            vocabulary: [],
        },
        {
            id: `expr-${Date.now()}-3`,
            level: "slang",
            korean: "에러 났어 ㅠㅠ",
            translation: "Got an error ㅠㅠ",
            context: "Very informal texting/internet style",
            grammarPoints: ["Past tense -었어", "Internet slang with emoticons"],
            culturalNote: "ㅠㅠ represents crying face, commonly used in Korean texting and online",
            vocabulary: [],
        }
    ]
}

/**
 * (PLACEHOLDER)
 * Vocabulary extraction helper (will be enhanced once implemented with NAVER API)
 */
export function extractKeyVocabulary(koreanText) {
  if (!koreanText) return [];
  
  const words = koreanText.split(/[\s,\.!\?]+/);
  const particles = ['은', '는', '이', '가', '을', '를', '에', '와', '과', '의', '도', '에서', '부터', '까지'];
  
  return words
    .filter(word => word.length > 1 && !particles.includes(word))
    .slice(0, 4);
}


