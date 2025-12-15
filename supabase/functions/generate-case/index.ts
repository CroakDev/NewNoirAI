import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || 'gsk_free';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tone = 'noir' } = await req.json();
    console.log('Generating case with tone:', tone);

    const toneDescriptions: Record<string, string> = {
      noir: 'Serious noir mystery with a dark, atmospheric tone. Think classic detective fiction.',
      light: 'Light investigation with subtle humor. Engaging but not too heavy.',
      dark: 'Dark mystery with morally ambiguous endings. Characters have complex motivations.'
    };

    const systemPrompt = `You are a master crime fiction writer creating an interactive investigation game. Your stories have the visual style of 1930s-1950s cartoons (Cuphead, Fleischer Studios) combined with noir atmosphere. Create a complete criminal investigation with:
- A unique crime (murder, theft, disappearance, fraud, etc.)
- 4-6 distinct characters with personalities
- 6-8 clues (mix of true leads and red herrings)
- 10-15 interconnected scenes with player choices
- Multiple endings (correct, incorrect, incomplete)

Narrative tone: ${toneDescriptions[tone] || toneDescriptions.noir}

ALL TEXT MUST BE IN PORTUGUESE (Brazil).

You MUST respond with a valid JSON object using this exact structure:
{
  "crime": {
    "id": "crime-1",
    "title": "string",
    "type": "murder|theft|disappearance|fraud|blackmail|smuggling",
    "victim": "string",
    "location": "string",
    "date": "string",
    "synopsis": "string"
  },
  "characters": [
    {
      "id": "char-1",
      "name": "string",
      "role": "suspect|witness|victim|detective|informant",
      "description": "string",
      "personality": "string",
      "secret": "string",
      "alibi": "string",
      "imagePrompt": "string"
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "name": "string",
      "description": "string",
      "type": "physical|testimonial|documentary|circumstantial",
      "isRedHerring": false,
      "relatedCharacterId": "char-1",
      "importance": "critical|important|minor"
    }
  ],
  "scenes": [
    {
      "id": "scene-1",
      "title": "string",
      "location": "string",
      "narrative": "string (2-4 paragraphs)",
      "mood": "neutral|tense|mysterious|dramatic|dangerous",
      "characters": ["char-1"],
      "choices": [
        {
          "id": "choice-1",
          "text": "string",
          "nextSceneId": "scene-2",
          "revealsClueId": "clue-1",
          "requiresClueId": "clue-2",
          "consequence": "string"
        }
      ],
      "isEnding": false,
      "endingType": "correct|incorrect|incomplete|partial"
    }
  ],
  "culpritId": "char-1",
  "motiveExplanation": "string"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a complete criminal investigation case for the game. Respond ONLY with valid JSON, no markdown formatting.' }
        ],
        temperature: 0.9,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    let investigation;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      investigation = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    console.log('Investigation generated:', investigation.crime?.title);

    return new Response(JSON.stringify(investigation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating case:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
