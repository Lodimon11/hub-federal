# Lambda — Formulario de Contacto Hub Federal

## Descripción

Esta Lambda recibe los datos del formulario de contacto y envía un email usando la API de Resend.

## Requisitos

- **Runtime**: Node.js 20.x
- **Handler**: `index.handler`
- **Memoria**: 128 MB (suficiente)
- **Timeout**: 10 segundos

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `RESEND_API_KEY` | API Key de Resend | `re_xxxxxxxxxx` |
| `CONTACT_EMAIL` | Email donde llegan los contactos | `contacto@hubfederal.com` |
| `ALLOWED_ORIGIN` | Dominio del frontend (CORS) | `https://hubfederal.com` |

## Pasos de Deploy

### 1. Crear la función Lambda

1. Ir a **AWS Console → Lambda → Create function**
2. Seleccionar **Author from scratch**
3. Nombre: `hub-federal-contact`
4. Runtime: **Node.js 20.x**
5. Architecture: **x86_64**
6. Crear la función

### 2. Subir el código

Opción A — Editor en consola:
- Copiar el contenido de `index.mjs` en el editor de código online

Opción B — ZIP upload:
```bash
cd lambda
zip function.zip index.mjs
# Subir el .zip desde la consola de Lambda
```

### 3. Configurar variables de entorno

1. En la función Lambda → **Configuration → Environment variables**
2. Agregar las 3 variables listadas arriba

### 4. Crear API Gateway (HTTP API)

1. Ir a **API Gateway → Create API → HTTP API**
2. Nombre: `hub-federal-api`
3. Agregar integración → Lambda → seleccionar `hub-federal-contact`
4. Crear ruta:
   - **Method**: POST
   - **Path**: `/contact`
5. Configurar CORS:
   - **Allowed origins**: `https://hubfederal.com` (o `*` para testing)
   - **Allowed methods**: POST, OPTIONS
   - **Allowed headers**: Content-Type
6. Deploy

### 5. Configurar el frontend

Copiar la URL del API Gateway y agregarla en el frontend:

```env
# .env.local (en el proyecto Next.js)
NEXT_PUBLIC_LAMBDA_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/contact
```

## Configurar Resend

1. Crear cuenta en [resend.com](https://resend.com)
2. Ir a **Domains** → agregar `hubfederal.com`
3. Configurar los registros DNS que indica Resend (SPF, DKIM)
4. Esperar verificación (~5 min)
5. Ir a **API Keys** → crear nueva key
6. Copiar la key y agregarla como variable de entorno en Lambda

## Testing

### Test con curl
```bash
curl -X POST https://YOUR_API_URL/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "company": "Mi Empresa",
    "message": "Hola, quiero consultar sobre envíos desde USA"
  }'
```

### Respuesta esperada
```json
{
  "message": "Email enviado correctamente",
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## Costos estimados

- **Lambda**: ~$0 (free tier: 1M requests/mes)
- **API Gateway**: ~$0 (free tier: 1M requests/mes)
- **Resend**: Free tier: 100 emails/día, 3000/mes
