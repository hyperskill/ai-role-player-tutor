# Tech Context: AI Role Player Tutor

## Technologies Used

### Frontend Stack
- **Nuxt 3** - Full-stack Vue framework with TypeScript support
- **Vue 3** - Composition API for reactive component development
- **TypeScript** - Strict typing throughout the application
- **Tailwind CSS v4** - Utility-first styling with modern CSS features
- **ShadCN Vue** - Component library with 'U' prefix (UCard, UButton, etc.)
- **@nuxt/icon** - Icon system using Lucide collection exclusively
- **@nuxt/image** - Optimized image handling and loading
- **@nuxt/fonts** - Font optimization and management

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions and authentication
- **Supabase Auth** - User authentication with email/password and OAuth support
- **Server API Routes** - Nuxt 3 server-side endpoints with TypeScript
- **Database Types** - Auto-generated TypeScript types from Supabase schema
- **Row Level Security (RLS)** - Database-level access control and content protection

### AI Integration
- **Vercel AI SDK** - TypeScript toolkit for AI features and streaming
- **OpenAI API** - GPT-4 Turbo for chat completions and content generation
- **AI Gateway** - Centralized AI provider management and monitoring

### Payment & Subscription Processing
- **Stripe** - Subscription management and payment processing
- **Stripe Webhooks** - Real-time payment event handling
- **Pro Subscription Gating** - Advanced feature access control

### Development Tools
- **ESLint** - Code linting with auto-fix capabilities
- **Lefthook** - Git hooks for pre-commit linting
- **TypeScript Compiler** - Strict mode enabled for enhanced type safety

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn package manager
- Supabase account and project
- OpenAI API key
- Stripe account (for payment features)

### Environment Configuration
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Development Commands
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production deployment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with auto-fix
- `npm run generate` - Generate static site (if needed)

## Technical Constraints
- **TypeScript Strict Mode**: No `any`, `as`, or `as any` usage allowed
- **Auto-Import Dependency**: Components, composables, and utilities must be auto-importable
- **Supabase RLS**: Row Level Security policies required for all database operations
- **Real-time Requirements**: Chat interface must support live message updates
- **Mobile Responsiveness**: All components must work across device sizes
- **Accessibility Standards**: WCAG compliance for educational platform requirements
- **Pro Subscription Access**: Advanced features must verify active subscription status
- **Content Ownership**: All content operations must verify user ownership and permissions

## Dependencies

### Core Dependencies
```json
{
  "nuxt": "^3.x",
  "@nuxtjs/supabase": "^1.x",
  "@nuxt/eslint": "^0.x",
  "ai": "^3.x",
  "@ai-sdk/openai": "^0.x",
  "stripe": "^14.x"
}
```

### UI Dependencies
```json
{
  "shadcn-nuxt": "^0.x",
  "@nuxt/icon": "^1.x",
  "@nuxt/image": "^1.x",
  "@nuxt/fonts": "^0.x",
  "tailwindcss": "^4.x"
}
```

## Tool Usage Patterns

### Supabase Client Patterns
```typescript
// Client-side (auto-imported)
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Server-side (manual import, always awaited)
const supabase = await serverSupabaseClient<{ cases: Cases }>(event)
const user = await requireAuth(event) // Custom auth utility
```

### Pro Subscription Access Control
```typescript
import { requireProSubscription } from '~/server/utils/requireProSubscription'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  // Verify Pro subscription for advanced features
  await requireProSubscription(event, user)

  // Pro feature logic here
})
```

### AI SDK Integration
```typescript
import { generateText } from 'ai'

const { text } = await generateText({
  model: 'xai/grok-3',
  system: systemPrompt,
  prompt: userInput,
  maxTokens: 1000,
  temperature: 0.7
})
```

### Content Management API Patterns
```typescript
// Case Management
PATCH /api/cases/[slug] - Update case (Pro-gated)
DELETE /api/cases/[slug] - Delete case (Pro-gated)
POST /api/cases/generate-case-by-domain - AI case generation (Pro-gated)

// Agent Management
PATCH /api/agents/[id] - Update agent (Pro-gated)

// Access Control Pattern
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await requireProSubscription(event, user)

  // Verify content ownership
  const content = await verifyOwnership(contentId, user.id)

  // Perform operation
})
```

### Component Auto-Imports
- **ShadCN Components**: `UCard`, `UButton`, `UInput` (direct usage, no imports)
- **Custom Components**: All components in `components/` directory auto-imported
- **Composables**: `useAuth()`, `useUser()`, `useSubscription()` auto-imported from `composables/`
- **Utilities**: `cn()` function auto-imported from `lib/utils.ts`

### Real-time Content Generation
```typescript
// Real-time subscription setup for content generation progress
const setupContentGenerationTracking = () => {
  supabase
    .channel('content-generation')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'cases',
      filter: `user_id=eq.${user.value.id}`
    }, handleCaseCreated)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'agents',
      filter: `user_id=eq.${user.value.id}`
    }, handleAgentCreated)
    .subscribe()
}

// Polling fallback for reliable updates
const pollForUpdates = () => {
  setInterval(async () => {
    const { data } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', user.value.id)
      .gte('created_at', generationStartTime)
      .order('created_at', { ascending: false })
      .limit(1)
  }, 2000)
}
```

### Database Type Safety
```typescript
import type { ExtendedChat, Message, Chat, Case, Agent } from '~/server/types'

// Always use typed Supabase client
const supabase = await serverSupabaseClient<{
  cases: Case[];
  agents: Agent[];
}>(event)
```

### Content Management Error Handling
```typescript
// Comprehensive error handling for content operations
try {
  const result = await contentOperation()
  return result
} catch (error) {
  // Extract serializable properties for logging
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStatus = error && typeof error === 'object' && 'status' in error ? error.status : undefined

  console.error('Content operation failed:', {
    message: errorMessage,
    status: errorStatus,
    userId: user.id,
    operation: 'content-update'
  })

  throw createError({
    statusCode: 500,
    statusMessage: 'Content operation failed'
  })
}
```
