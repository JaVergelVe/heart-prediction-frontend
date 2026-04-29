#!/bin/bash
# =============================================================================
# deploy-s3.sh — Despliega el frontend Angular en AWS S3 (Static Website)
# Proyecto: Heart Attack Prediction — Tesis
#
# Uso:
#   bash deploy-s3.sh              # primer despliegue (crea bucket)
#   bash deploy-s3.sh --update     # actualizar archivos existentes
#   bash deploy-s3.sh --destroy    # eliminar bucket y todos los recursos
# =============================================================================

set -e

# ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
BUCKET_NAME="heart-prediction-frontend"
REGION="us-east-1"
BUILD_DIR="dist/heart-prediction-frontend/browser"
# ──────────────────────────────────────────────────────────────────────────────

MODE="${1:-}"

# ─── DESTRUIR ─────────────────────────────────────────────────────────────────
if [ "$MODE" = "--destroy" ]; then
  echo "⚠️  Eliminando bucket S3: $BUCKET_NAME"
  aws s3 rm "s3://$BUCKET_NAME" --recursive
  aws s3api delete-bucket --bucket "$BUCKET_NAME" --region "$REGION"
  echo "✅ Bucket eliminado. Costo = \$0"
  exit 0
fi

# ─── BUILD ────────────────────────────────────────────────────────────────────
echo "🔨 Construyendo Angular en modo producción..."
npm run build -- --configuration production

# Verificar que el build generó archivos
if [ ! -d "$BUILD_DIR" ]; then
  # Angular 17 puede generar en dist/<name>/browser o dist/<name>
  BUILD_DIR="dist/heart-prediction-frontend"
  if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ No se encontró el directorio de build. Verifica angular.json"
    exit 1
  fi
fi
echo "✅ Build completado en: $BUILD_DIR"

# ─── CREAR BUCKET (solo en primer despliegue) ─────────────────────────────────
if [ "$MODE" != "--update" ]; then
  echo "🪣 Creando bucket S3: $BUCKET_NAME"

  # us-east-1 NO acepta LocationConstraint (es el default)
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION"

  # Desactivar Block Public Access (necesario para hosting estático)
  aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
      "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

  # Política de bucket: acceso público de lectura
  aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy "{
      \"Version\": \"2012-10-17\",
      \"Statement\": [{
        \"Sid\": \"PublicReadGetObject\",
        \"Effect\": \"Allow\",
        \"Principal\": \"*\",
        \"Action\": \"s3:GetObject\",
        \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
      }]
    }"

  # Habilitar Static Website Hosting con fallback a index.html (SPA routing)
  aws s3api put-bucket-website \
    --bucket "$BUCKET_NAME" \
    --website-configuration '{
      "IndexDocument": {"Suffix": "index.html"},
      "ErrorDocument": {"Key": "index.html"}
    }'

  echo "✅ Bucket configurado para hosting estático"
fi

# ─── SUBIR ARCHIVOS ───────────────────────────────────────────────────────────
echo "📤 Subiendo archivos a S3..."

# Subir assets con cache largo (1 año) — tienen hash en el nombre
aws s3 sync "$BUILD_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

# Subir index.html sin cache (siempre fresco)
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

echo ""
echo "✅ Despliegue completado"
echo "🌐 URL pública: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "⚠️  Recuerda agregar esta URL al CORS_ORIGINS del backend:"
echo "   http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
