import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Forzar dinámico
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { model } = await request.json()

        if (!model) {
            return NextResponse.json(
                { error: 'Modelo requerido' },
                { status: 400 }
            )
        }

        const apiKey = process.env.GEMINI_API_KEY

        // Mock data si no hay API key
        if (!apiKey) {
            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            return NextResponse.json({
                model_detected: model,
                ram: {
                    type: "DDR4 SODIMM",
                    max_capacity: "32GB",
                    slots: 2,
                    current_estimated: "8GB/16GB",
                    upgrade_recommendation: "Kingston Fury Impact 32GB (2x16GB) 3200MHz"
                },
                storage: {
                    type: "NVMe M.2 PCIe Gen 3/4",
                    slots: "2 (1 ocupado)",
                    max_capacity: "2TB por slot",
                    upgrade_recommendation: "Samsung 980 Pro 1TB NVMe"
                },
                analysis: "Este equipo es ideal para gaming de gama media y edición ligera. El cuello de botella actual suele ser la RAM si tienes 8GB. El segundo slot M.2 permite expandir almacenamiento sin formatear."
            })
        }

        const genAI = new GoogleGenAI({ apiKey })

        const prompt = `Actúa como un experto técnico en hardware de notebooks.
        Analiza el siguiente modelo de notebook: "${model}".
        
        Devuelve un JSON estrictamente con la siguiente estructura (sin markdown):
        {
            "model_detected": "Nombre completo verificado del modelo",
            "ram": {
                "type": "Tipo de memoria (ej: DDR4 3200Mz SODIMM)",
                "max_capacity": "Capacidad máxima soportada total",
                "slots": "Cantidad total de slots",
                "upgrade_recommendation": "Recomendación específica de upgrade premium"
            },
            "storage": {
                "type": "Tipo de almacenamiento (ej: NVMe M.2 PCIe Gen4)",
                "slots": "Detalle de slots disponibles (cantidad y tipo)",
                "max_capacity": "Capacidad máxima recomendada",
                "upgrade_recommendation": "Recomendación específica de SSD premium"
            },
            "analysis": "Breve análisis técnico de 2 lineas sobre la viabilidad y beneficio del upgrade para este modelo específico."
        }
        Si el modelo es ambiguo o no existe, trata de inferir el más probable o devuelve datos genéricos seguros aclarando en 'model_detected' que es una estimación.`

        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })

        const responseText = response.text || ''
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)

        if (!jsonMatch) {
            throw new Error('Formato de respuesta inválido')
        }

        const data = JSON.parse(jsonMatch[0])
        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Error specs analysis:', error)
        return NextResponse.json(
            { error: 'Error al analizar especificaciones' },
            { status: 500 }
        )
    }
}
