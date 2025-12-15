import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = 'character' } = await req.json();
    console.log('Generating image:', type, prompt);

    const stylePrefix = `1930s-1950s cartoon style, vectorized art, bold outlines, solid colors, noir atmosphere, Cuphead/Fleischer Studios inspired, vintage animation aesthetic. `;

    const typeEnhancements: Record<string, string> = {
      character: 'Character portrait, expressive face, dramatic lighting, detective noir style, centered composition. ',
      scene: 'Wide scene, atmospheric, moody lighting, rain effects, urban noir environment. ',
      clue: 'Object focus, dramatic spotlight, evidence style, mysterious atmosphere. '
    };

    const fullPrompt = encodeURIComponent(stylePrefix + (typeEnhancements[type] || '') + prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?width=512&height=512&seed=${Date.now()}&nologo=true&enhance=true`;

    console.log('Image URL generated');

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, imageUrl: null }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
