import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Usar a variável de ambiente do projeto
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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

ALL TEXT MUST BE IN PORTUGUESE (Brazil).`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a complete criminal investigation case for the game.' }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'create_investigation',
            description: 'Create a complete criminal investigation with all required elements',
            parameters: {
              type: 'object',
              properties: {
                crime: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string', description: 'Catchy title for the case' },
                    type: { type: 'string', enum: ['murder', 'theft', 'disappearance', 'fraud', 'blackmail', 'smuggling'] },
                    victim: { type: 'string' },
                    location: { type: 'string' },
                    date: { type: 'string' },
                    synopsis: { type: 'string', description: 'Brief synopsis shown at the start' }
                  },
                  required: ['id', 'title', 'type', 'victim', 'location', 'date', 'synopsis']
                },
                characters: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string', enum: ['suspect', 'witness', 'victim', 'detective', 'informant'] },
                      description: { type: 'string' },
                      personality: { type: 'string' },
                      secret: { type: 'string', description: 'Hidden information about this character' },
                      alibi: { type: 'string' },
                      imagePrompt: { type: 'string', description: 'Prompt to generate character portrait in 1930s cartoon style' }
                    },
                    required: ['id', 'name', 'role', 'description', 'personality', 'imagePrompt']
                  }
                },
                clues: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      type: { type: 'string', enum: ['physical', 'testimonial', 'documentary', 'circumstantial'] },
                      isRedHerring: { type: 'boolean' },
                      relatedCharacterId: { type: 'string' },
                      importance: { type: 'string', enum: ['critical', 'important', 'minor'] }
                    },
                    required: ['id', 'name', 'description', 'type', 'isRedHerring', 'importance']
                  }
                },
                scenes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      location: { type: 'string' },
                      narrative: { type: 'string', description: 'The story text shown to the player (2-4 paragraphs)' },
                      mood: { type: 'string', enum: ['neutral', 'tense', 'mysterious', 'dramatic', 'dangerous'] },
                      characters: { 
                        type: 'array', 
                        items: { type: 'string' },
                        description: 'Character IDs present in this scene'
                      },
                      choices: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            text: { type: 'string' },
                            nextSceneId: { type: 'string' },
                            revealsClueId: { type: 'string' },
                            requiresClueId: { type: 'string' },
                            consequence: { type: 'string' }
                          },
                          required: ['id', 'text', 'nextSceneId']
                        }
                      },
                      isEnding: { type: 'boolean' },
                      endingType: { type: 'string', enum: ['correct', 'incorrect', 'incomplete', 'partial'] }
                    },
                    required: ['id', 'title', 'location', 'narrative', 'mood', 'characters', 'choices']
                  }
                },
                culpritId: { type: 'string', description: 'ID of the character who committed the crime' },
                motiveExplanation: { type: 'string', description: 'Full explanation of the crime and motive' }
              },
              required: ['crime', 'characters', 'clues', 'scenes', 'culpritId', 'motiveExplanation']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'create_investigation' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }
    
    const investigation = JSON.parse(toolCall.function.arguments);
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