# Skill: Supabase Integrity Guard

## Propósito
Asegurar que cada interacción con la base de datos y el almacenamiento de Supabase sea exitosa, previniendo errores silenciosos y "productos fantasma".

---

## 1. Storage (Buckets & Uploads)

### Verificación de Bucket
Antes de subir una imagen, siempre verificar si el bucket existe:
```typescript
const { data: buckets } = await supabase.storage.listBuckets()
const bucketExists = buckets?.some(b => b.name === 'smartpoint-media')
if (!bucketExists) {
  // Notificar al admin que debe crear el bucket
  throw new Error('Bucket no configurado. Contacta al administrador.')
}
```

### Subida Robusta
```typescript
const uploadImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('smartpoint-media')
    .upload(path, file, { upsert: true })
  
  if (error) {
    // Mostrar toast con error específico, no genérico
    toast.error(`Error al subir imagen: ${error.message}`)
    return null
  }
  
  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('smartpoint-media')
    .getPublicUrl(data.path)
  
  return publicUrl
}
```

### Políticas RLS para Storage
El bucket `smartpoint-media` debe tener las siguientes políticas:
- **SELECT**: `true` (público para lectura)
- **INSERT**: `auth.role() = 'authenticated'` (solo usuarios logueados)
- **UPDATE/DELETE**: `auth.uid() = owner_id` (solo el creador)

---

## 2. Manejo de Errores

### Regla de Oro
Nunca mostrar errores genéricos. Siempre capturar el mensaje específico:

```typescript
try {
  const { error } = await supabase.from('inventario').insert(data)
  if (error) throw error
} catch (err: any) {
  // Extraer mensaje legible
  const message = err.message || 'Error desconocido'
  
  // Mapear errores comunes
  if (message.includes('violates unique constraint')) {
    toast.error('Este SKU ya existe. Usa uno diferente.')
  } else if (message.includes('violates foreign key')) {
    toast.error('Referencia inválida. Verifica los datos.')
  } else {
    toast.error(`Error: ${message}`)
  }
}
```

---

## 3. Validación Pre-Guardado

Antes de insertar un producto en la DB, validar que la imagen se haya subido correctamente:

```typescript
const onSubmit = async (data: ProductForm, imageFile: File | null) => {
  let imageUrl = data.imagen_url
  
  // Si hay archivo, subir primero
  if (imageFile) {
    const uploadedUrl = await uploadImage(imageFile, `productos/${data.sku}`)
    if (!uploadedUrl) {
      toast.error('No se pudo subir la imagen. Producto no guardado.')
      return // BLOQUEAR guardado
    }
    imageUrl = uploadedUrl
  }
  
  // Solo guardar si la imagen está OK
  const { error } = await supabase.from('inventario').insert({
    ...data,
    imagen_url: imageUrl
  })
  
  if (error) {
    toast.error(`Error al guardar: ${error.message}`)
  } else {
    toast.success('Producto guardado correctamente')
    router.push('/admin/productos')
  }
}
```

---

## 4. Verificación de Rutas API

Si usas API Routes de Next.js, verificar que:
1. El archivo esté en `app/api/[ruta]/route.ts` (no `page.ts`)
2. Exportes las funciones con los nombres correctos: `GET`, `POST`, `PUT`, `DELETE`
3. El método de la petición coincida con la función exportada

Ejemplo correcto:
```typescript
// app/api/products/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  // ... lógica
  return Response.json({ success: true })
}
```
