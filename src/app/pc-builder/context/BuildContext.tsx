'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Tipos de componentes de hardware
export type ComponentCategory = 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'case' | 'cooling' | 'cables' | 'os'
export type StylePalette = 'stealth_black' | 'pure_white' | 'rgb'
export type Tier = 'budget' | 'midrange' | 'high-end' | 'enthusiast'

export interface HardwareComponent {
    id: string
    sku: string
    nombre: string
    categoria: ComponentCategory
    marca: string
    specs: Record<string, any>
    precio_venta: number
    precio_anterior?: number
    stock_actual: number
    bajo_pedido: boolean
    oferta_activa: boolean
    color_palette: StylePalette[]
    imagen_url?: string
    imagen_transparente?: string
    tier: Tier
}

export interface CompatibilityError {
    component: ComponentCategory
    message: string
    severity: 'error' | 'warning'
    type?: 'socket' | 'power' | 'dimensions' | 'bottleneck'
}

export interface BuildState {
    cpu: HardwareComponent | null
    gpu: HardwareComponent | null
    ram: HardwareComponent | null
    storage: HardwareComponent | null
    psu: HardwareComponent | null
    motherboard: HardwareComponent | null
    case: HardwareComponent | null
    cooling: HardwareComponent | null
    cables: HardwareComponent | null
    os: HardwareComponent | null
}

interface BuildContextType {
    // Estado
    build: BuildState
    styleFilter: StylePalette | null
    nightMode: boolean

    // Acciones
    selectComponent: (component: HardwareComponent) => CompatibilityError[]
    removeComponent: (category: ComponentCategory) => void
    setStyleFilter: (style: StylePalette | null) => void
    toggleNightMode: () => void
    clearBuild: () => void

    // Cálculos
    totalPrice: number
    totalPower: number
    powerLevel: number // 0-100
    compatibilityErrors: CompatibilityError[]
}

const initialBuild: BuildState = {
    cpu: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    motherboard: null,
    case: null,
    cooling: null,
    cables: null,
    os: null,
}

const BuildContext = createContext<BuildContextType | undefined>(undefined)

// Reglas de compatibilidad de Socket
const SOCKET_COMPATIBILITY: Record<string, string[]> = {
    'AM5': ['Ryzen 7000', 'Ryzen 9000', '7800X3D', '7600X', '7950X'],
    'AM4': ['Ryzen 3000', 'Ryzen 5000', '5800X', '5600X'],
    'LGA1700': ['12th Gen', '13th Gen', '14th Gen', '14700K', '14600K', '13900K'],
    'LGA1200': ['10th Gen', '11th Gen'],
}

// Calcular consumo de energía
function estimatePowerConsumption(build: BuildState): number {
    let total = 100 // Base system (fans, etc)

    if (build.cpu?.specs?.tdp) total += build.cpu.specs.tdp
    if (build.gpu?.specs?.tdp) total += build.gpu.specs.tdp

    // RAM, storage, etc consumen poco
    if (build.ram) total += 10
    if (build.storage) total += 10
    if (build.cooling?.specs?.type === 'AIO') total += 15

    return total
}

// Validar compatibilidad
function validateBuild(build: BuildState): CompatibilityError[] {
    const errors: CompatibilityError[] = []

    // 1. Validar Socket CPU <-> Motherboard
    if (build.cpu && build.motherboard) {
        const cpuSocket = build.cpu.specs?.socket
        const moboSocket = build.motherboard.specs?.socket

        if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
            errors.push({
                component: 'cpu',
                message: `Socket incompatible: CPU usa ${cpuSocket} pero la placa es ${moboSocket}`,
                severity: 'error',
                type: 'socket'
            })
        }
    }

    // 2. Validar Potencia PSU
    if (build.psu) {
        const requiredPower = estimatePowerConsumption(build) * 1.2 // 20% headroom
        const psuWatts = build.psu.specs?.watts || 0

        if (psuWatts < requiredPower) {
            errors.push({
                component: 'psu',
                message: `Fuente insuficiente: Necesitás al menos ${Math.ceil(requiredPower)}W (tu fuente tiene ${psuWatts}W)`,
                severity: 'error',
                type: 'power'
            })
        }
    }

    // 3. Validar Dimensiones GPU <-> Case
    if (build.gpu && build.case) {
        const gpuLength = build.gpu.specs?.length_mm || 0
        const maxLength = build.case.specs?.max_gpu_length || 999

        if (gpuLength > maxLength) {
            errors.push({
                component: 'gpu',
                message: `GPU muy larga: ${gpuLength}mm (máximo del gabinete: ${maxLength}mm)`,
                severity: 'error',
                type: 'dimensions'
            })
        }
    }

    // 4. Validar Cooler Height <-> Case
    if (build.cooling && build.case && build.cooling.specs?.type === 'Air') {
        const coolerHeight = build.cooling.specs?.height || 0
        const maxHeight = build.case.specs?.max_cooler_height || 999

        if (coolerHeight > maxHeight) {
            errors.push({
                component: 'cooling',
                message: `Cooler muy alto: ${coolerHeight}mm (máximo: ${maxHeight}mm)`,
                severity: 'error',
                type: 'dimensions'
            })
        }
    }

    // 5. Cuello de botella (warning)
    if (build.cpu && build.gpu) {
        const tierOrder: Tier[] = ['budget', 'midrange', 'high-end', 'enthusiast']
        const cpuTierIndex = tierOrder.indexOf(build.cpu.tier)
        const gpuTierIndex = tierOrder.indexOf(build.gpu.tier)

        if (Math.abs(cpuTierIndex - gpuTierIndex) > 1) {
            const bottleneck = cpuTierIndex < gpuTierIndex ? 'CPU' : 'GPU'
            errors.push({
                component: bottleneck === 'CPU' ? 'cpu' : 'gpu',
                message: `Posible cuello de botella: ${bottleneck} muy ${cpuTierIndex < gpuTierIndex ? 'débil' : 'potente'} para el resto del sistema`,
                severity: 'warning',
                type: 'bottleneck'
            })
        }
    }

    return errors
}

export function BuildProvider({ children }: { children: ReactNode }) {
    const [build, setBuild] = useState<BuildState>(initialBuild)
    const [styleFilter, setStyleFilter] = useState<StylePalette | null>(null)
    const [nightMode, setNightMode] = useState(false)

    const selectComponent = useCallback((component: HardwareComponent): CompatibilityError[] => {
        const newBuild = { ...build, [component.categoria]: component }
        const errors = validateBuild(newBuild)

        // Solo bloquear si hay errores críticos
        const hasBlockingError = errors.some(e => e.severity === 'error')

        if (!hasBlockingError) {
            setBuild(newBuild)
        }

        return errors
    }, [build])

    const removeComponent = useCallback((category: ComponentCategory) => {
        setBuild(prev => ({ ...prev, [category]: null }))
    }, [])

    const toggleNightMode = useCallback(() => {
        setNightMode(prev => !prev)
    }, [])

    const clearBuild = useCallback(() => {
        setBuild(initialBuild)
    }, [])

    // Cálculos
    const totalPrice = Object.values(build)
        .filter(Boolean)
        .reduce((sum, comp) => sum + (comp?.precio_venta || 0), 0)

    const totalPower = estimatePowerConsumption(build)

    // Power level basado en tier de GPU
    const tierPower: Record<Tier, number> = { budget: 25, midrange: 50, 'high-end': 75, enthusiast: 100 }
    const powerLevel = build.gpu ? tierPower[build.gpu.tier] : 0

    const compatibilityErrors = validateBuild(build)

    return (
        <BuildContext.Provider value={{
            build,
            styleFilter,
            nightMode,
            selectComponent,
            removeComponent,
            setStyleFilter,
            toggleNightMode,
            clearBuild,
            totalPrice,
            totalPower,
            powerLevel,
            compatibilityErrors,
        }}>
            {children}
        </BuildContext.Provider>
    )
}

export function useBuild() {
    const context = useContext(BuildContext)
    if (!context) {
        throw new Error('useBuild must be used within BuildProvider')
    }
    return context
}
