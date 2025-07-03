# System Patterns: AI Role Player Tutor

## System Architecture
**Three-Layer Architecture with Administrative Layer:**
- **Frontend Layer**: Nuxt 3 with Vue 3 Composition API, ShadCN Vue components, Tailwind CSS v4
- **API Layer**: Server-side API routes with TypeScript, Supabase integration, AI SDK integration
- **Database Layer**: Supabase with real-time subscriptions, structured relational data
- **Administrative Layer**: Pro-subscription gated content management and editing capabilities

**Core Data Models:**
- **Cases**: Study scenarios with stories, learning outcomes, dependencies, and difficulty levels
- **Agents**: AI personas with roles, positions, and conversation prompts
- **Chats**: Conversation sessions linking users, cases, agents with full message history
- **Users**: Authentication and progress tracking via Supabase Auth
- **Subscriptions**: Pro-tier access control for advanced features and content management

## Key Technical Decisions
- **Nuxt 3 Over Next.js**: Full-stack framework with excellent TypeScript support and auto-imports
- **Supabase Over Firebase**: Superior developer experience, real-time capabilities, and PostgreSQL benefits
- **Vercel AI SDK**: Standardized AI integration with streaming support and provider flexibility
- **ShadCN Vue with 'U' Prefix**: Consistent UI components with Tailwind integration and accessibility features
- **TypeScript Strict Mode**: Enhanced code safety and developer experience throughout the stack
- **Server-Side API Routes**: Centralized business logic with proper authentication and error handling
- **Pro Subscription Gating**: Advanced features restricted to paying subscribers for sustainable business model

## Design Patterns in Use
- **Composition API Pattern**: Vue 3 composables for shared logic (useAuth, useUser, useSubscription)
- **Auto-Import Pattern**: Nuxt 3 auto-imports for components, composables, and utilities
- **Progressive Enhancement**: Cases unlock based on prerequisite completion for structured learning
- **Repository Pattern**: Supabase client abstractions with typed database operations
- **Factory Pattern**: AI agent generation with template-based prompts and persona creation
- **Observer Pattern**: Real-time chat updates via Supabase subscriptions
- **Authorization Pattern**: Multi-layered access control with authentication and subscription verification
- **Content Management Pattern**: CRUD operations with ownership verification and subscription gating

## Component Relationships
```
App Layout (default.vue/case.vue)
├── AppSidebar (navigation, user info)
├── AuthOverlay (login/signup modals)
└── Page Components
    ├── Content Management (Pro-gated)
    │   ├── CreateCase (AI-powered case generation)
    │   ├── EditCase (comprehensive case editing)
    │   └── EditAgent (agent personality customization)
    ├── Learning Interface
    │   ├── CaseCard/LockedCaseCard (case selection)
    │   ├── ChatInterface (conversation management)
    │   │   ├── ChatMessage (individual messages)
    │   │   ├── ChatInput (user input handling)
    │   │   └── ChatHistoryView (conversation history)
    │   ├── CaseStory (case context display)
    │   └── LearningOutcomes (educational goals)
    └── Administrative Components
        ├── ContentManagement (Pro user content tools)
        └── SubscriptionCheck (access control components)
```

## Critical Implementation Paths
- **Authentication Flow**: Supabase Auth → useAuth composable → auth middleware → protected routes
- **Subscription Verification**: User auth → subscription check → Pro feature access/redirect to pricing
- **Content Creation Flow**: Pro verification → AI generation → real-time progress → content saving
- **Content Management Flow**: Ownership verification → Pro subscription check → CRUD operations
- **Chat Creation**: Case selection → agent assignment → database insert → real-time subscription setup
- **AI Response Generation**: User message → context gathering → OpenAI API → agent-specific response → database update
- **Progress Tracking**: Case completion → status updates → dependency resolution → new case unlocking

## API Endpoint Patterns
```
Content Management (Pro-gated):
/api/cases/generate-case-by-domain.post.ts - AI case generation
/api/cases/[slug].patch.ts - Case editing
/api/cases/[slug].delete.ts - Case deletion
/api/agents/[id].patch.ts - Agent editing

Learning Interface:
/api/cases/[slug].get.ts - Individual case details
/api/chats/create.post.ts - New chat session creation
/api/chats/[id]/messages.post.ts - Message handling
/api/chats/[id]/generate-response.post.ts - AI response generation
/api/chats/[id]/status.patch.ts - Chat status updates
/api/chats/[id]/submit-case.post.ts - Case completion and assessment

Payment & Subscription:
/api/stripe/* - Payment processing endpoints
```

## Authorization Patterns
**Multi-Layer Access Control:**
```
1. Authentication Layer: requireAuth() - Ensures user is logged in
2. Subscription Layer: requireProSubscription() - Verifies active Pro subscription
3. Ownership Layer: User ID verification for content access
4. Permission Layer: RLS policies in Supabase for database-level security
```

**Access Control Flow:**
```
Request → Authentication Check → Subscription Verification → Ownership Validation → Database RLS → Action
```

## Database Relationships
- Users → Subscriptions (one-to-one active subscription)
- Users → Cases (one-to-many, user-created content)
- Users → Agents (one-to-many, user-created agents)
- Users → Chats (one-to-many)
- Cases → Chats (one-to-many)
- Agents → Chats (one-to-many)
- Cases → Cases (self-referential dependencies via can_be_done_after)
- Cases → Agents (one-to-one assignment for generated content)
- Chats contain JSON message arrays with typed Message interface

## Content Management Architecture
**Pro-Subscription Gated Features:**
- Case creation and editing
- Agent customization and management
- Content deletion and management
- Advanced administrative tools

**Real-time Content Generation:**
- Progress tracking via Supabase real-time subscriptions
- Polling fallbacks for reliable updates
- Multi-step AI workflows with status updates
- Error handling and recovery mechanisms
