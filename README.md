# Heart Attack Prediction - Frontend

Aplicación web Angular para predicción de riesgo de ataque cardíaco.

## 🚀 Tecnologías

- **Framework**: Angular 17+
- **UI Library**: Angular Material 17
- **State Management**: RxJS + Services
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Charts**: Chart.js / ngx-charts
- **PDF**: jsPDF (para visualización)
- **Testing**: Jasmine + Karma
- **E2E**: Cypress
- **Node**: 18+ LTS

## 📋 Prerrequisitos

- Node.js 18+ LTS
- npm 9+ o yarn 1.22+
- Angular CLI 17+
- Git

## 🛠️ Setup Desarrollo Local

### 1. Clonar Repositorio

```bash
git clone https://github.com/tu-org/heart-prediction-frontend.git
cd heart-prediction-frontend
```

### 2. Instalar Angular CLI (si no lo tienes)

```bash
npm install -g @angular/cli@17
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/v1',
  apiTimeout: 30000,
  enableDebugLogs: true
};
```

### 5. Iniciar Servidor de Desarrollo

```bash
ng serve
```

O con configuración específica:

```bash
ng serve --host 0.0.0.0 --port 4200 --open
```

### 6. Acceder a la Aplicación

- **App**: http://localhost:4200
- **Hot Reload**: Habilitado por defecto

## 🏗️ Build

### Build de Desarrollo

```bash
ng build
```

### Build de Producción

```bash
ng build --configuration production
```

Los archivos se generan en `dist/heart-prediction-frontend/`

### Analizar Bundle Size

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/heart-prediction-frontend/stats.json
```

## 🧪 Tests

### Tests Unitarios

```bash
# Ejecutar todos los tests
ng test

# Ejecutar con cobertura
ng test --code-coverage

# Ejecutar sin watch mode
ng test --watch=false
```

Ver reporte de cobertura:
```bash
open coverage/heart-prediction-frontend/index.html  # Mac
start coverage/heart-prediction-frontend/index.html # Windows
```

### Tests E2E

```bash
# Usando Cypress
npm run e2e

# Abrir Cypress UI
npm run e2e:open
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios singleton, guards, interceptors
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── storage.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── prediction.model.ts
│   │       └── api-response.model.ts
│   │
│   ├── features/                # Módulos por funcionalidad
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── auth.module.ts
│   │   │   └── auth-routing.module.ts
│   │   ├── prediction/
│   │   │   ├── components/
│   │   │   │   ├── prediction-form/
│   │   │   │   └── prediction-result/
│   │   │   ├── prediction.module.ts
│   │   │   └── prediction-routing.module.ts
│   │   ├── history/
│   │   └── profile/
│   │
│   ├── shared/                  # Componentes reutilizables
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── loading-spinner/
│   │   ├── pipes/
│   │   └── shared.module.ts
│   │
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
│
├── assets/                      # Imágenes, iconos, etc.
├── environments/                # Configuración por ambiente
└── styles/                      # Estilos globales
```

## 🔧 Comandos Útiles

### Generar Componentes

```bash
# Componente
ng generate component features/prediction/components/risk-chart

# Servicio
ng generate service core/services/prediction

# Guard
ng generate guard core/guards/auth

# Interceptor
ng generate interceptor core/interceptors/logging

# Pipe
ng generate pipe shared/pipes/risk-level
```

### Linting y Formato

```bash
# Linting
ng lint

# Fix automático
ng lint --fix

# Prettier (si está configurado)
npm run format
```

### Actualizar Dependencias

```bash
# Ver actualizaciones disponibles
ng update

# Actualizar Angular
ng update @angular/core @angular/cli

# Actualizar Angular Material
ng update @angular/material
```

## 🎨 Temas y Estilos

La aplicación usa Angular Material con tema personalizado:

```scss
// src/styles/theme.scss
@use '@angular/material' as mat;

$primary: mat.define-palette(mat.$indigo-palette);
$accent: mat.define-palette(mat.$pink-palette);
$warn: mat.define-palette(mat.$red-palette);

$theme: mat.define-light-theme((
  color: (
    primary: $primary,
    accent: $accent,
    warn: $warn,
  )
));

@include mat.all-component-themes($theme);
```

## 🔐 Autenticación

La app usa JWT tokens almacenados en localStorage:

```typescript
// Login
this.authService.login(email, password).subscribe(
  response => {
    // Token guardado automáticamente
    this.router.navigate(['/dashboard']);
  }
);

// Logout
this.authService.logout();

// Verificar autenticación
if (this.authService.isAuthenticated()) {
  // Usuario autenticado
}
```

## 📡 Llamadas a API

Todas las llamadas usan el servicio centralizado:

```typescript
// Ejemplo: Crear predicción
this.apiService.post<PredictionResponse>('/predictions', data)
  .subscribe(
    response => console.log(response.data),
    error => console.error(error)
  );
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t heart-prediction-frontend:latest .
```

### Ejecutar con Docker

```bash
docker run -p 80:80 heart-prediction-frontend:latest
```

### Docker Compose (con Backend)

```bash
# En el directorio raíz con docker-compose.yml
docker-compose up -d
```

## 🚀 Deploy

### Deploy a AWS S3 + CloudFront

```bash
# Build producción
ng build --configuration production

# Subir a S3 (requiere AWS CLI configurado)
aws s3 sync dist/heart-prediction-frontend/ s3://your-bucket-name --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Deploy a Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/heart-prediction-frontend
```

### Deploy a Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📝 Variables de Entorno

### Development (`environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/v1',
  apiTimeout: 30000,
  enableDebugLogs: true
};
```

### Production (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.heart-prediction.com/v1',
  apiTimeout: 30000,
  enableDebugLogs: false
};
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@angular/core'"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Port 4200 already in use

```bash
# Usar otro puerto
ng serve --port 4201

# O matar el proceso
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4200 | xargs kill -9
```

### Error: CORS en desarrollo

Asegúrate que el backend tenga configurado CORS para `http://localhost:4200`

### Build falla por memoria

```bash
# Aumentar memoria de Node
export NODE_OPTIONS="--max-old-space-size=8192"
ng build --configuration production
```

## 📚 Documentación Adicional

- [Contratos de API](../api-contracts.md)
- [Requerimientos](../requirements.md)
- [README Backend](../README-BACKEND.md)

## 🤝 Contribuir

1. Crear rama desde `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-feature
   ```

2. Hacer cambios y commits:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. Push y crear Pull Request:
   ```bash
   git push origin feature/nombre-feature
   ```

Ver más detalles en [Convenciones de Git](../github-structure.md#convenciones-de-git)

## 📄 Licencia

Este proyecto es parte de una tesis de pregrado.

## 👥 Autores

- **Frontend Development**: [Nombre amigo]
- **ML & Infraestructura**: [Tu nombre]

## 📞 Contacto

Para preguntas o issues, crear un issue en GitHub o contactar a los autores.
