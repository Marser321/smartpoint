import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Forzar que esta ruta sea dinámica (no pre-renderizada)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json(
                { error: 'No se proporcionó imagen' },
                { status: 400 }
            )
        }

        // Verificar API key
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            // Modo demo si no hay API key
            return NextResponse.json({
                dispositivo: 'iPhone 14 Pro (Demo)',
                daño: 'Pantalla con grietas visibles',
                gravedad: 'alta'
            })
        }

        // Inicializar cliente solo cuando hay API key
        const genAI = new GoogleGenAI({ apiKey })

        // Extraer base64 de la imagen (quitar el prefijo data:image/...)
        const base64Image = image.split(',')[1]

        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Analiza esta imagen de un dispositivo electrónico dañado. 
                            Identifica:
                            1. El tipo y modelo del dispositivo (ej: iPhone 14 Pro, Samsung Galaxy S23)
                            2. El daño visible (ej: pantalla rota, cristal trasero dañado, puerto de carga dañado)
                            3. La gravedad del daño (alta, media, baja)
                            
                            IMPORTANTE: Responde SOLO con un JSON válido en este formato exacto, sin markdown ni texto adicional:
                            {"dispositivo": "...", "daño": "...", "gravedad": "alta|media|baja"}
                            
                            Si no puedes identificar el dispositivo o el daño, usa valores descriptivos genéricos.`
                        },
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: base64Image
                            }
                        }
                    ]
                }
            ]
        })

        // Extraer texto de la respuesta
        const responseText = response.text || ''

        // Intentar parsear JSON de la respuesta
        let resultado
        try {
            // Limpiar posible markdown
            const jsonMatch = responseText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                resultado = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No se encontró JSON en la respuesta')
            }
        } catch {
            // Fallback si el parsing falla
            resultado = {
                dispositivo: 'Dispositivo móvil',
                daño: 'Daño no identificado - requiere revisión presencial',
                gravedad: 'media'
            }
        }

        return NextResponse.json(resultado)

    } catch (error: any) {
        console.error('Error en análisis de daño:', error)

        return NextResponse.json(
            { error: error.message || 'Error al analizar la imagen' },
            { status: 500 }
        )
    }
}
