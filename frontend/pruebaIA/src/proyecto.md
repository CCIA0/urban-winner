Documentación del Frontend - Diario Emocional Angular
📋 Descripción General
Aplicación Angular que proporciona una interfaz de usuario tipo chat para el diario emocional y un dashboard analítico para supervisores.

🏗️ Arquitectura
Estructura de Carpetas
text
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── api.service.ts          # Servicio principal de API
│   │   │   ├── auth.service.ts         # Servicio de autenticación
│   │   │   ├── dashboard.service.ts    # Servicio de dashboard
│   │   │   └── index.ts                # Barrel exports
│   │   ├── models/
│   │   │   ├── journal-entry.ts        # Modelo de entrada de diario
│   │   │   ├── dashboard-data.ts       # Modelo de datos del dashboard
│   │   │   └── index.ts                # Barrel exports
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Guard de autenticación
│   │   └── interceptors/
│   │       └── auth.interceptor.ts     # Interceptor de autenticación
│   ├── features/
│   │   ├── journal/
│   │   │   ├── components/
│   │   │   │   └── journal-chat/
│   │   │   │       ├── journal-chat.component.ts
│   │   │   │       ├── journal-chat.component.html
│   │   │   │       ├── journal-chat.component.scss
│   │   │   │       └── journal-chat.component.spec.ts
│   │   │   ├── pages/
│   │   │   │   └── journal-page/
│   │   │   │       ├── journal-page.component.ts
│   │   │   │       ├── journal-page.component.html
│   │   │   │       ├── journal-page.component.scss
│   │   │   │       └── journal-page.component.spec.ts
│   │   │   └── journal-routing.module.ts
│   │   └── dashboard/
│   │       ├── components/
│   │       │   ├── sentiment-chart/
│   │       │   ├── emotion-grid/
│   │       │   └── user-stats/
│   │       ├── pages/
│   │       │   └── dashboard-page/
│   │       └── dashboard-routing.module.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   ├── error-message/
│   │   │   └── sentiment-badge/
│   │   ├── pipes/
│   │   │   ├── sentiment-color.pipe.ts
│   │   │   └── emotion-icon.pipe.ts
│   │   └── directives/
│   │       └── auto-scroll.directive.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.module.ts
├── assets/
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── global.scss
│   └── images/
└── environments/
    ├── environment.ts
    └── environment.prod.ts
🎯 Componentes Principales
JournalPageComponent
Responsabilidad: Página contenedora del diario emocional

Características
Layout principal de la página

Contenedor del componente de chat

Manejo de routing

JournalChatComponent
Responsabilidad: Interfaz tipo chat para el diario emocional

Funcionalidades
typescript
sendMessage()          // Enviar mensaje al diario
loadEntries()          // Cargar historial
formatTime()           // Formatear timestamp
formatDate()           // Formatear fecha
scrollToBottom()       // Scroll automático
DashboardPageComponent
Responsabilidad: Panel de control para supervisores

Métricas Mostradas
👥 Usuarios registrados

📝 Entradas totales

😊 Sentimiento promedio

📅 Actividad semanal

🎭 Top emociones

📊 Stats por usuario

🔌 Servicios
ApiService
typescript
interface ApiService {
  createEntry(entry: CreateEntryRequest): Observable<JournalEntry>
  getUserEntries(userId: string): Observable<JournalEntry[]>
  getDashboard(): Observable<any>
}
DashboardService
typescript
interface DashboardService {
  getDashboardData(): Observable<DashboardData>
  normalizeDashboardData(data: any): DashboardData
  ensureArray(value: any): any[]
  ensureSentimentArray(value: any): any[]
  ensureEmotionArray(value: any): any[]
  getDefaultDashboardData(): DashboardData
}
📊 Modelos de Datos
JournalEntry
typescript
interface JournalEntry {
  id: number;
  text: string;
  user_id: string;
  sentiment_analysis: {
    sentiment: { label: string; probabilities: any };
    emotion: { label: string; probabilities: any };
  };
  ai_feedback: string;
  created_at: string;
}
DashboardData
typescript
interface DashboardData {
  total_users: number;
  total_entries: number;
  avg_sentiment_score: number;
  entries_last_week: number;
  sentiment_distribution: SentimentItem[];
  top_emotions: EmotionItem[];
  users_stats: UserStat[];
}
🎨 Interfaz de Usuario
Journal Interface
Diseño: Chat moderno tipo WhatsApp/Messenger

Elementos:

Burbujas de mensajes diferenciadas (usuario/IA)

Avatares con emojis

Timestamps relativos

Indicadores visuales de sentimiento

Input de mensaje flotante

Estados de carga y error

Dashboard Interface
Diseño: Panel de métricas tipo admin dashboard

Elementos:

Cards de resumen con iconos

Barras de progreso animadas

Grid de emociones con emojis

Stats por usuario en cards

Loading skeletons

Empty states

🛠️ Tecnologías Utilizadas
Angular 19: Framework principal con standalone components

RxJS: Programación reactiva y manejo de estados

TypeScript: Tipado estático para mejor desarrollo

SCSS: Estilos avanzados con variables y mixins

Angular Forms: Gestión de formularios reactivos

Angular Router: Navegación SPA

🔄 Flujo de Datos
Flujo del Diario
Usuario escribe mensaje → JournalChatComponent

Llamada a apiService.createEntry()

Backend procesa → Analiza con PySentimiento → Guarda en DB

UI actualiza con nueva entrada + respuesta de IA

Flujo del Dashboard
Componente se inicializa → ngOnInit()

Llama a dashboardService.getDashboardData()

Normaliza datos del backend → Presentación visual

Renderiza métricas y gráficos

🎨 Sistema de Diseño
Paleta de Colores
Primario: #667eea (Azul)

Secundario: #764ba2 (Púrpura)

Success: #4caf50 (Verde)

Warning: #ff9800 (Naranja)

Error: #f44336 (Rojo)

Fondo: #f5f7fb (Gris claro)

Texto: #2c3e50 (Gris oscuro)

Sentimientos
POS: Verde (#4caf50)

NEU: Naranja (#ff9800)

NEG: Rojo (#f44336)

Emociones con Emojis
joy: 😊

sadness: 😢

anger: 😠

fear: 😨

surprise: 😲

disgust: 🤢

neutral: 😐

📱 Responsive Design
Breakpoints
Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

Adaptaciones
Stack vertical en móviles

Grid adaptable en dashboard

Menús colapsables

Touch-friendly buttons

Font sizes responsive

🔍 Manejo de Errores
Estrategias
Loading states durante peticiones

Mensajes de error descriptivos

Fallback a datos por defecto

Reintentos automáticos

Error boundaries

Estados de UI
Cargando: Spinners y skeletons

Éxito: Datos actualizados + feedback

Error: Mensajes + opción de reintento

Vacío: Empty states ilustrados

🚀 Optimizaciones
Performance
OnPush change detection strategy

Lazy loading de módulos

Virtual scrolling para listas largas

Cache de peticiones HTTP

Bundle optimization

UX
Animaciones CSS suaves

Feedback visual inmediato

Navegación con keyboard shortcuts

Accesibilidad (ARIA labels)

Loading optimístico

📝 Próximas Mejoras
Funcionalidades
Exportación de reportes PDF/CSV

Filtros por fecha y sentimiento

Notificaciones push

Modo oscuro

Multiidioma

Técnicas
PWA capabilities

Offline support con IndexedDB

Real-time updates con WebSockets

Internationalization (i18n)

E2E testing

🚀 Comandos de Desarrollo
Instalación
bash
npm install
Desarrollo
bash
npm start
# o
ng serve --open
Build
bash
npm run build
# o
ng build
Tests
bash
npm test
# o
ng test
🌐 Configuración de Entornos
environment.ts
typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  enableDebug: true
};
environment.prod.ts
typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api.com/api/v1',
  enableDebug: false
};
🔗 Integración con Backend
Configuración API
typescript
const baseUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  createEntry(entry: CreateEntryRequest): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(`${this.baseUrl}/journal/entries`, entry);
  }
  
  // ... más métodos
}
Headers HTTP
typescript
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};