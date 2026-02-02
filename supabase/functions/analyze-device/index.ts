import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const SYSTEM_PROMPT = `Eres un experto técnico en reparación de dispositivos móviles.
Analiza la imagen del dispositivo y responde SOLO en JSON válido:

{
  "es_dispositivo": boolean,
  "modelo_estimado": "string (ej: iPhone 13 Pro, Samsung Galaxy S21)",
  "marca": "string (Apple, Samsung, Xiaomi, Motorola, etc)",
  "dano_detectado": ["array de daños visibles"],
  "gravedad": "leve" | "moderado" | "severo",
  "precio_estimado_uyu": number
}

Precios base en Uruguay (UYU):
- Pantalla iPhone 8-SE: 3500
- Pantalla iPhone X-11: 4500
- Pantalla iPhone 12-13: 5500
- Pantalla iPhone 14-15: 7500
- Pantalla Samsung A series: 2500
- Pantalla Samsung S series: 5000
- Batería cualquier modelo: 1500-2500
- Cámara trasera: 2500-4500
- Puerto de carga: 1500-2000
- Vidrio trasero: 2000-4000

Si no puedes identificar el dispositivo claramente, estima basándote en características visibles.
Si la imagen no es de un dispositivo, responde con es_dispositivo: false.`;

Deno.serve(async (req: Request) => {
    // CORS
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            return new Response(
                JSON.stringify({ error: "Se requiere imagen en base64" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!GEMINI_API_KEY) {
            // Demo mode sin API key
            return new Response(
                JSON.stringify({
                    es_dispositivo: true,
                    modelo_estimado: "iPhone 13 Pro",
                    marca: "Apple",
                    dano_detectado: ["Pantalla rota", "Vidrio astillado"],
                    gravedad: "moderado",
                    precio_estimado_uyu: 5500,
                    demo_mode: true,
                }),
                { headers: { "Content-Type": "application/json" } }
            );
        }

        // Clean base64 if it has data URL prefix
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        // Call Gemini Vision API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: SYSTEM_PROMPT },
                                {
                                    inline_data: {
                                        mime_type: "image/jpeg",
                                        data: cleanBase64,
                                    },
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        );

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
        }

        const geminiData = await geminiResponse.json();
        const textResponse =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Parse JSON from response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No se pudo parsear la respuesta de IA");
        }

        const resultado = JSON.parse(jsonMatch[0]);

        return new Response(JSON.stringify(resultado), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Error al analizar la imagen" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
});
