# System Patterns: AI Role Player Tutor

## System Architecture
**Three-Layer Architecture:**
- **Frontend Layer**: Nuxt 3 with Vue 3 Composition API, ShadCN Vue components, Tailwind CSS v4
- **API Layer**: Server-side API routes with TypeScript, Supabase integration, AI SDK integration
- **Database Layer**: Supabase with real-time subscriptions, structured relational data

**Core Data Models:**
- **Cases**: Study scenarios with stories, learning outcomes, dependencies, and difficulty levels
- **Agents**: AI personas with roles, positions, and conversation prompts
- **Chats**: Conversation sessions linking users, cases, agents with full message history
- **Users**: Authentication and progress tracking via Supabase Auth

## Key Technical Decisions
- **Nuxt 3 Over Next.js**: Full-stack framework with excellent TypeScript support and auto-imports
- **Supabase Over Firebase**: Superior developer experience, real-time capabilities, and PostgreSQL benefits
- **Vercel AI SDK**: Standardized AI integration with streaming support and provider flexibility
- **ShadCN Vue with 'U' Prefix**: Consistent UI components with Tailwind integration and accessibility features
- **TypeScript Strict Mode**: Enhanced code safety and developer experience throughout the stack
- **Server-Side API Routes**: Centralized business logic with proper authentication and error handling

## Design Patterns in Use
- **Composition API Pattern**: Vue 3 composables for shared logic (useAuth, useUser, useSubscription)
- **Auto-Import Pattern**: Nuxt 3 auto-imports for components, composables, and utilities
- **Progressive Enhancement**: Cases unlock based on prerequisite completion for structured learning
- **Repository Pattern**: Supabase client abstractions with typed database operations
- **Factory Pattern**: AI agent generation with template-based prompts and persona creation
- **Observer Pattern**: Real-time chat updates via Supabase subscriptions

## Component Relationships
```
App Layout (default.vue/case.vue)
├── AppSidebar (navigation, user info)
├── AuthOverlay (login/signup modals)
└── Page Components
    ├── CaseCard/LockedCaseCard (case selection)
    ├── ChatInterface (conversation management)
    │   ├── ChatMessage (individual messages)
    │   ├── ChatInput (user input handling)
    │   └── ChatHistoryView (conversation history)
    ├── CaseStory (case context display)
    └── LearningOutcomes (educational goals)
```

## Critical Implementation Paths
- **Authentication Flow**: Supabase Auth → useAuth composable → auth middleware → protected routes
- **Chat Creation**: Case selection → agent assignment → database insert → real-time subscription setup
- **AI Response Generation**: User message → context gathering → OpenAI API → agent-specific response → database update
- **Progress Tracking**: Case completion → status updates → dependency resolution → new case unlocking
- **Subscription Management**: Stripe checkout → webhook processing → database updates → access control

## API Endpoint Patterns
```
/api/cases/[slug].get.ts - Individual case details
/api/chats/create.post.ts - New chat session creation
/api/chats/[id]/messages.post.ts - Message handling
/api/chats/[id]/generate-response.post.ts - AI response generation
/api/chats/[id]/status.patch.ts - Chat status updates
/api/stripe/* - Payment processing endpoints
```

## Database Relationships
- Users → Chats (one-to-many)
- Cases → Chats (one-to-many)
- Agents → Chats (one-to-many)
- Cases → Cases (self-referential dependencies via can_be_done_after)
- Chats contain JSON message arrays with typed Message interface
