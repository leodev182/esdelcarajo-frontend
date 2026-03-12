# Del Carajo — Frontend

Aplicación web de e-commerce para **Del Carajo**, marca de ropa urbana venezolana. Construida con Next.js App Router, ofrece catálogo de productos, carrito, checkout, favoritos y panel de administración.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 + TypeScript 5 (App Router) |
| Estilos | Tailwind CSS 4 |
| Componentes UI | shadcn/ui (Radix UI) |
| Estado del servidor | TanStack Query v5 |
| Formularios | React Hook Form + Zod |
| HTTP Client | Axios |
| Autenticación | JWT + Google OAuth (via backend) |
| Monitoreo | Sentry |
| Notificaciones | Sonner |
| Iconos | Lucide React |

---

## Requisitos previos

- Node.js >= 20
- npm >= 10
- Backend corriendo en `http://localhost:3001` (ver [esdelcarajo-backend](../esdelcarajo-backend/README.md))

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores reales
```

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# URL del frontend (usada en redirecciones OAuth)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Levantar el proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

Aplicación disponible en `http://localhost:3000`

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build de producción |
| `npm run lint` | Verificar errores de ESLint |

---

## Estructura del proyecto

```
app/                        # Rutas Next.js App Router
├── (root)/page.tsx         # Landing page
├── catalogo/               # Catálogo de productos
│   ├── [categoria]/        # Filtrado por categoría
│   └── [categoria]/[subcategoria]/
├── product/[slug]/         # Detalle de producto
├── checkout/               # Flujo de pago
├── favoritos/              # Lista de favoritos
├── order/[id]/             # Seguimiento de órdenes
├── perfil/                 # Perfil, direcciones, historial
├── auth/callback/          # Callback OAuth
└── admin/                  # Panel de administración

src/
├── components/
│   ├── admin/              # Componentes del panel admin
│   ├── auth/               # Login, callback OAuth
│   ├── bcv/                # Visualización tasa BCV
│   ├── cart/               # Carrito y drawer
│   ├── catalogo/           # Página de catálogo y filtros
│   ├── checkout/           # Formulario y flujo de pago
│   ├── layout/             # Header, Footer, MegaMenu
│   ├── order/              # Detalle de orden
│   ├── product/            # Cards, detalle, grid de productos
│   └── ui/                 # Primitivos shadcn/ui
├── context/
│   └── AuthContext.tsx     # Estado global de autenticación
└── lib/
    ├── api/                # Clientes API por módulo (axios)
    ├── hooks/              # Custom hooks (useProducts, useBcv, etc.)
    ├── types/              # Interfaces TypeScript
    ├── config/             # Estilos por categoría
    ├── providers/          # QueryProvider (TanStack Query)
    ├── utils/              # Logger, constantes, helpers
    └── fonts/              # Configuración tipografía

public/                     # Assets estáticos (imágenes, logo)
```

---

## Funcionalidades principales

- **Catálogo** — Filtros por categoría, subcategoría, búsqueda y paginación
- **Producto** — Galería de imágenes, selección de variantes (talla, color, género), stock en tiempo real
- **Carrito** — Drawer persistente, expiración automática de items
- **Checkout** — Formulario de dirección, selección de método de pago, comprobante de transferencia
- **Favoritos** — Lista de productos guardados por usuario autenticado
- **Perfil** — Edición de datos, gestión de direcciones, historial de órdenes
- **Admin** — Gestión de productos, categorías, órdenes, usuarios y secciones del landing
- **Tasa BCV** — Conversión de precios EUR → Bolívares en tiempo real con caché de 1 hora
