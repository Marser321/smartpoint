'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Producto } from '@/types/ecommerce'

// Schema de validación
const productSchema = z.object({
    sku: z.string().min(3, 'SKU mínimo 3 caracteres'),
    nombre: z.string().min(3, 'Nombre mínimo 3 caracteres'),
    descripcion: z.string().min(10, 'Descripción mínima 10 caracteres'),
    tipo: z.enum(['funda', 'vidrio', 'cargador', 'cable', 'auricular', 'repuesto', 'accesorio']),
    marca: z.string().min(1, 'Marca requerida'),
    precio_venta: z.coerce.number().min(0, 'Precio debe ser positivo'),
    stock_actual: z.coerce.number().min(0),
    stock_critico: z.coerce.number().min(0),
    imagen_url: z.string().optional(),
    activo: z.boolean().default(true),
    moneda: z.string().default('UYU'),
})

type ProductFormData = z.infer<typeof productSchema>

export default function ProductEditPage() {
    const router = useRouter()
    const params = useParams()
    const isNew = params.id === 'nuevo'

    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            sku: '',
            nombre: '',
            descripcion: '',
            tipo: 'accesorio' as const,
            marca: '',
            precio_venta: 0,
            stock_actual: 0,
            stock_critico: 5,
            imagen_url: '',
            activo: true,
            moneda: 'UYU'
        }
    })

    const currentImageUrl = watch('imagen_url')

    // Cargar producto existente
    useEffect(() => {
        if (!isNew) {
            const fetchProduct = async () => {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('inventario')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (error) {
                    toast.error('Error al cargar producto')
                    return
                }

                if (data) {
                    reset(data)
                    if (data.imagen_url) {
                        setImagePreview(data.imagen_url)
                    }
                }
                setLoading(false)
            }
            fetchProduct()
        }
    }, [isNew, params.id, reset])

    // Drag & Drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        } else {
            toast.error('Solo se permiten imágenes (JPG, PNG, WebP)')
        }
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setValue('imagen_url', '')
    }

    // Subir imagen a Supabase Storage
    const uploadImage = async (file: File, sku: string): Promise<string | null> => {
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${sku}-${Date.now()}.${fileExt}`
        const filePath = `productos/${fileName}`

        setUploading(true)

        const { data, error } = await supabase.storage
            .from('smartpoint-media')
            .upload(filePath, file, { upsert: true })

        setUploading(false)

        if (error) {
            toast.error(`Error al subir imagen: ${error.message}`)
            return null
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('smartpoint-media')
            .getPublicUrl(data.path)

        return publicUrl
    }

    // Submit del formulario
    const onSubmit = async (data: z.infer<typeof productSchema>) => {
        setSaving(true)
        const supabase = createClient()

        try {
            let imageUrl = data.imagen_url || ''

            // Si hay archivo nuevo, subir primero
            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile, data.sku)
                if (!uploadedUrl) {
                    toast.error('No se pudo subir la imagen. Producto no guardado.')
                    setSaving(false)
                    return // BLOQUEAR guardado si falla la imagen
                }
                imageUrl = uploadedUrl
            }

            const productData = {
                ...data,
                imagen_url: imageUrl,
                es_venta: true,
                imagenes_adicionales: []
            }

            if (isNew) {
                const { error } = await supabase
                    .from('inventario')
                    .insert([productData])

                if (error) throw error
                toast.success('Producto creado exitosamente')
            } else {
                const { error } = await supabase
                    .from('inventario')
                    .update(productData)
                    .eq('id', params.id)

                if (error) throw error
                toast.success('Producto actualizado')
            }

            router.push('/admin/productos')
        } catch (error: any) {
            // Mapear errores comunes
            if (error.message?.includes('violates unique constraint')) {
                toast.error('Este SKU ya existe. Usá uno diferente.')
            } else if (error.message?.includes('violates foreign key')) {
                toast.error('Referencia inválida. Verificá los datos.')
            } else {
                toast.error(`Error: ${error.message || 'Error desconocido'}`)
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--sp-red)]" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        {isNew ? 'Nuevo Producto' : 'Editar Producto'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={saving || uploading}
                    className="
                        flex items-center gap-2 px-6 py-2.5 rounded-xl
                        bg-[var(--sp-red)] text-white font-medium
                        hover:bg-[var(--sp-red-dark)] transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                    {saving || uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {uploading ? 'Subiendo...' : saving ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">Información General</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Nombre del Producto</label>
                            <input
                                {...register('nombre')}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                                placeholder="Ej: Funda iPhone 14"
                            />
                            {errors.nombre && <span className="text-red-400 text-xs">{errors.nombre.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">SKU</label>
                            <input
                                {...register('sku')}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                                placeholder="Ej: FND-IP14-001"
                            />
                            {errors.sku && <span className="text-red-400 text-xs">{errors.sku.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Descripción</label>
                        <textarea
                            {...register('descripcion')}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none resize-none transition-colors"
                            placeholder="Detalles del producto..."
                        />
                        {errors.descripcion && <span className="text-red-400 text-xs">{errors.descripcion.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Marca</label>
                            <input
                                {...register('marca')}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Categoría</label>
                            <select
                                {...register('tipo')}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                            >
                                <option value="funda" className="bg-gray-900">Funda</option>
                                <option value="vidrio" className="bg-gray-900">Vidrio Templado</option>
                                <option value="cargador" className="bg-gray-900">Cargador</option>
                                <option value="cable" className="bg-gray-900">Cable</option>
                                <option value="auricular" className="bg-gray-900">Auricular</option>
                                <option value="accesorio" className="bg-gray-900">Accesorio</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Drag & Drop Image Upload */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Imagen Principal</h3>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                relative aspect-square rounded-xl border-2 border-dashed
                                transition-all duration-300 cursor-pointer overflow-hidden
                                ${isDragging
                                    ? 'border-[var(--sp-red)] bg-[var(--sp-red)]/10'
                                    : 'border-white/20 hover:border-white/40 bg-white/[0.02]'
                                }
                            `}
                        >
                            {imagePreview || currentImageUrl ? (
                                <div className="relative w-full h-full group">
                                    <img
                                        src={imagePreview || currentImageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-green-500/80 text-white text-xs flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Imagen lista
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full cursor-pointer p-4 text-center">
                                    <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-[var(--sp-red)]' : 'text-white/30'}`} />
                                    <p className="text-sm text-white/50">
                                        {isDragging ? 'Soltá la imagen aquí' : 'Arrastrá una imagen aquí'}
                                    </p>
                                    <p className="text-xs text-white/30 mt-1">o hacé clic para seleccionar</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-[var(--sp-red)] mx-auto mb-2" />
                                        <p className="text-sm text-white">Subiendo...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inventory & Price */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Inventario & Precio</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Precio Venta (UYU)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-white/50">$</span>
                                <input
                                    type="number"
                                    {...register('precio_venta')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Stock Actual</label>
                                <input
                                    type="number"
                                    {...register('stock_actual')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Stock Crítico</label>
                                <input
                                    type="number"
                                    {...register('stock_critico')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-[var(--sp-red)] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                {...register('activo')}
                                id="activo"
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[var(--sp-red)] focus:ring-[var(--sp-red)]"
                            />
                            <label htmlFor="activo" className="text-sm text-white/70 cursor-pointer">
                                Producto Activo en Tienda
                            </label>
                        </div>
                    </div>
                </div>
            </motion.form>
        </div>
    )
}
