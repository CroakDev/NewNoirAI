import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Usar a variável de ambiente do projeto
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type = 'ambient', prompt } = await req.json();
    console.log('Generating SFX:', type, prompt);

    // If no ElevenLabs key, return a placeholder response
    if (!ELEVENLABS_API_KEY) {
      console.log('No ElevenLabs API key configured, returning placeholder');
      return new Response(JSON.stringify({ 
        audioUrl: null, 
        message: 'Audio generation requires ElevenLabs API key' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sfxPrompts: Record<string, string> = {
      ambient: 'Jazz noir ambient music, soft saxophone, piano, moody atmosphere, 1940s detective style',
      rain: 'Heavy rain on city streets, thunder in distance, urban night ambiance',
      footsteps: 'Footsteps on wet cobblestone street at night',
      door: 'Old wooden door creaking open slowly',
      tension: 'Suspenseful music sting, dramatic revelation moment',
      discovery: 'Discovery sound effect, mysterious finding, detective clue found'
    };

    const finalPrompt = prompt || sfxPrompts[type] || sfxPrompts.ambient;

    const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: finalPrompt,
        duration_seconds: type === 'ambient' ? 15 : 5,
        prompt_influence: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', response.status, errorText);
      throw new Error(`SFX generation error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);

    return new Response(JSON.stringify({ 
      audioUrl: `data:audio/mpeg;base64,${base64Audio}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating SFX:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, audioUrl: null }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});