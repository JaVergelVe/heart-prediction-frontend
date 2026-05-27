# Guía de Despliegue — Frontend Angular en AWS S3

## Arquitectura

```
Usuario (navegador)
        │
        ▼  HTTP
S3 Static Website Hosting
  bucket: heart-prediction-frontend
  URL: http://heart-prediction-frontend.s3-website-us-east-1.amazonaws.com
        │
        ▼  HTTP → puerto 8000
EC2 t2.micro (ya desplegado)
  IP: 52.54.223.60
  FastAPI + Docker
```

**¿Por qué S3 y no CloudFront?**
- S3 Static Website Hosting es 100% Free Tier (5GB, 20K GETs/mes)
- CloudFront agrega complejidad innecesaria para un proyecto de tesis
- Si usaras CloudFront (HTTPS), el navegador bloquearía las llamadas al backend
  por Mixed Content (backend corre en HTTP)

---

## Prerequisitos

### 1. AWS CLI instalado y configurado
```bash
# Verificar instalación
aws --version

# Configurar credenciales (si no lo has hecho)
aws configure
# AWS Access Key ID: [tu key]
# AWS Secret Access Key: [tu secret]
# Default region: us-east-1
# Default output format: json
```

### 2. Node.js y Angular CLI
```bash
node --version   # >= 18
npm --version
npx ng version   # Angular CLI 17
```

---

## Primer despliegue (desde cero)

### Paso 1 — Instalar dependencias
```bash
cd heart-prediction-frontend
npm install
```

### Paso 2 — Verificar environment.prod.ts
El archivo `src/environments/environment.prod.ts` debe tener:
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://52.54.223.60:8000',  // IP Elastic del backend
  apiTimeout: 30000,
  enableDebugLogs: false
};
```

### Paso 3 — Ejecutar el script de despliegue
```bash
bash deploy-s3.sh
```

Esto hace automáticamente:
1. `ng build --configuration production`
2. Crea el bucket S3 con hosting estático habilitado
3. Configura acceso público y política de bucket
4. Sube los archivos con headers de caché correctos
5. Muestra la URL pública

### Paso 4 — Actualizar CORS en el backend

Edita `heart-prediction-backend/.env` en EC2 y agrega la URL del bucket:

```bash
# Conectarse a EC2
ssh -i ~/.ssh/id_rsa ec2-user@52.54.223.60

# Editar .env del contenedor
cd /opt/heart-prediction
nano .env
```

Agrega o actualiza la variable:
```
CORS_ORIGINS=http://localhost:4200,http://127.0.0.1:4200,http://heart-prediction-frontend.s3-website-us-east-1.amazonaws.com
```

Reinicia el contenedor para aplicar cambios:
```bash
docker compose down && docker compose up -d
```

### Paso 5 — Verificar
Abre en el navegador:
```
http://heart-prediction-frontend.s3-website-us-east-1.amazonaws.com
```

---

## Actualizar el frontend (después de cambios)

```bash
cd heart-prediction-frontend
bash deploy-s3.sh --update
```

Esto reconstruye y sube solo los archivos cambiados (`--delete` elimina los obsoletos).

---

## Eliminar recursos (costo = $0)

```bash
bash deploy-s3.sh --destroy
```

Para volver a desplegar después:
```bash
bash deploy-s3.sh
```

---

## Manejo de rutas SPA (Angular Router)

El script configura el bucket con `ErrorDocument: index.html`.
Esto hace que cualquier ruta como `/dashboard` o `/predictions/history`
devuelva `index.html` y Angular Router maneje la navegación.

**Sin esta configuración**, al refrescar una ruta interna obtendrías un 403/404 de S3.

---

## Estrategia de caché

| Archivo | Cache-Control | Razón |
|---------|--------------|-------|
| `index.html` | `no-cache` | Siempre fresco para detectar nuevas versiones |
| `*.js`, `*.css`, assets | `max-age=31536000, immutable` | Tienen hash en el nombre, cambian con cada build |

---

## Estimación de costos (Free Tier)

| Recurso | Free Tier | Costo fuera |
|---------|-----------|-------------|
| S3 almacenamiento | 5 GB/mes | $0.023/GB |
| S3 GET requests | 20,000/mes | $0.0004/1000 |
| S3 PUT requests | 2,000/mes | $0.005/1000 |
| Transferencia saliente | 100 GB/mes | $0.09/GB |

Para un proyecto de tesis: **costo prácticamente $0**.

---

## Posibles problemas y soluciones

### ❌ Error CORS en el navegador
**Síntoma**: `Access to XMLHttpRequest blocked by CORS policy`

**Causa**: La URL del bucket S3 no está en `CORS_ORIGINS` del backend.

**Solución**:
1. Verifica que `CORS_ORIGINS` en el `.env` del backend incluye exactamente:
   `http://heart-prediction-frontend.s3-website-us-east-1.amazonaws.com`
2. Reinicia el contenedor Docker en EC2

---

### ❌ Rutas internas dan 403 al refrescar
**Síntoma**: Al navegar a `/dashboard` directamente o refrescar, S3 devuelve error.

**Causa**: El bucket no tiene configurado `ErrorDocument`.

**Solución**: El script ya lo configura. Si lo creaste manualmente, ejecuta:
```bash
aws s3api put-bucket-website \
  --bucket heart-prediction-frontend \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'
```

---

### ❌ El bucket ya existe (nombre tomado)
Los nombres de bucket S3 son globales en AWS. Si `heart-prediction-frontend` ya existe,
cambia `BUCKET_NAME` en `deploy-s3.sh` por algo único como `heart-prediction-frontend-tesis-2026`.

---

### ❌ Mixed Content (si en el futuro usas HTTPS)
Si agregas CloudFront con HTTPS al frontend, el navegador bloqueará las llamadas
al backend en `http://`. Solución: agregar HTTPS al backend también (certificado
en EC2 con nginx + Let's Encrypt, o mover el backend detrás de CloudFront también).

---

### ⚠️ La IP del backend cambia
La IP `52.54.223.60` es una Elastic IP — es fija mientras no la liberes.
Si destruyes la infraestructura con Terraform y la recreas, obtendrás una IP nueva.
En ese caso actualiza `environment.prod.ts` y vuelve a ejecutar `bash deploy-s3.sh --update`.
