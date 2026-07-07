# RAG System Frontend

A modern, responsive React application for document-based AI chat interactions. Built with TypeScript, Vite, and Tailwind CSS, this frontend provides a seamless interface for managing documents and conducting AI-powered conversations.

**Live demo:** https://arag-swart.vercel.app &nbsp;·&nbsp; **Guest mode (no signup):** https://arag-swart.vercel.app/try

Backend: https://github.com/R1ch3rd/arag_backend

## 🚀 Features

### 🔐 Authentication System
- **User Registration & Login**: Complete signup/signin flow with email verification
- **AWS Cognito Integration**: Secure authentication with JWT tokens
- **Password Management**: Reset and change password functionality
- **Email Verification**: Confirmation code support for new accounts
- **Session Management**: Automatic token refresh and secure logout
- **Protected Routes**: Route-level authentication guards

### 📁 Document Management
- **File Upload**: Drag-and-drop or click-to-upload interface
- **Multiple Format Support**: PDF, TXT, DOC, and other document formats
- **Document Processing**: Automatic text extraction and chunking
- **Document Status Tracking**: Real-time processing status (uploading, processing, ready, error)
- **Document Activation**: Enable/disable documents for chat sessions
- **Document Library**: View, manage, and organize uploaded documents
- **File Size Validation**: Smart file size limits and validation
- **Batch Operations**: Multiple document management capabilities
- **Document Preview**: View document contents and metadata
- **Smart Caching**: Optimized document loading and caching

### 💬 Advanced Chat System
- **Multi-Session Support**: Create and manage multiple chat conversations
- **AI Model Selection**: Choose between multiple AI models (Gemini 2.5 Flash, Together AI models)
- **Model Locking**: Automatic model locking after first message in session
- **Conversation History**: Persistent chat history across sessions
- **Smart Context**: AI responses based on uploaded document content
- **Source Citations**: View document sources for AI responses
- **Real-time Responses**: Streaming chat interface with typing indicators
- **Message Threading**: Organized conversation flow
- **Chat Export**: Export conversations in markdown format
- **Session Search**: Find specific conversations quickly

### 🎨 User Interface & Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI Components**: Clean, intuitive interface with Tailwind CSS
- **Sidebar Navigation**: Collapsible sidebar for easy navigation
- **Mobile-First**: Touch-friendly mobile interface
- **Loading States**: Comprehensive loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and recovery options
- **Toast Notifications**: Non-intrusive success and error notifications
- **Keyboard Shortcuts**: Power-user keyboard navigation
- **Accessibility**: WCAG-compliant interface elements

### 🔧 Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **React 18**: Latest React features with hooks and concurrent rendering
- **Vite Build System**: Fast development and optimized production builds
- **API Integration**: Seamless integration with AWS Lambda backend
- **CORS Handling**: Proper cross-origin request management
- **Cache Management**: Intelligent client-side caching system
- **Error Boundaries**: Graceful error handling and recovery
- **Code Splitting**: Optimized bundle splitting for faster loads
- **PWA Ready**: Progressive Web App capabilities

### 📊 Session Management
- **Session Creation**: Smart session creation with active document validation
- **Session Persistence**: Resume conversations across browser sessions
- **Session Organization**: Sort and filter conversations by date, title, or content
- **Title Editing**: Custom chat titles with inline editing
- **Session Cleanup**: Automatic cleanup of empty sessions
- **Session Analytics**: Message count and activity tracking
- **Bulk Operations**: Delete multiple sessions efficiently

### 🛡️ Security & Privacy
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Data Encryption**: Client-side data protection
- **CORS Protection**: Proper cross-origin resource sharing configuration
- **Input Validation**: Comprehensive client-side input sanitization
- **XSS Protection**: Cross-site scripting prevention measures
- **Privacy Controls**: User data management and deletion options

## 🛠️ Technology Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **CSS Modules** - Scoped styling system
- **Responsive Design** - Mobile-first, adaptive layouts

### State Management
- **React Context** - Global state management for auth and cache
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Client-side data persistence
- **Cache Manager** - Intelligent data caching system

### API & Backend Integration
- **Fetch API** - Modern HTTP client
- **AWS Cognito** - Authentication service integration
- **RESTful APIs** - Clean API communication
- **CORS Handling** - Cross-origin request management

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with ES6+ support

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd arag_frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
Create a `.env.local` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-gateway-url.com/prod
VITE_AWS_REGION=us-east-1

# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=false
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, Sidebar, etc.)
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── Chat/           # Chat-specific components
├── pages/              # Page components and routes
│   ├── auth/           # Authentication pages
│   ├── Chat.tsx        # Main chat interface
│   ├── Documents.tsx   # Document management
│   └── Home.tsx        # Landing page
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── CacheContext.tsx # Cache management
├── services/           # API and external service integrations
│   ├── api.ts          # Base API client
│   ├── auth.ts         # Authentication service
│   ├── chat.ts         # Chat API service
│   ├── documents.ts    # Document API service
│   └── cacheManager.ts # Client-side cache management
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── styles/             # Global styles and Tailwind config
└── config/             # Configuration files
```

## 🚀 Development

### Development Server
```bash
npm run dev
```
Starts the development server with hot reload at `http://localhost:5173`

### Building for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Testing
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🌐 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy the dist/ directory to your hosting service
```

### Environment-Specific Builds
```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

## 🔧 Configuration

### Vite Configuration
The project uses Vite with custom configuration for:
- **Proxy Setup**: Development API proxy to bypass CORS
- **Build Optimization**: Code splitting and bundle optimization
- **Environment Variables**: Secure environment variable handling
- **Asset Processing**: Optimized asset bundling

### Tailwind Configuration
Custom Tailwind setup with:
- **Design System**: Consistent colors, spacing, and typography
- **Component Classes**: Reusable component-specific styles
- **Responsive Breakpoints**: Mobile-first responsive design
- **Dark Mode**: Theme switching capabilities (if enabled)

### API Proxy (Development)
```javascript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://your-api-gateway-url.com/prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
```

## 📱 Mobile Support

### Responsive Features
- **Touch-Optimized**: Gesture-friendly interface
- **Mobile Navigation**: Collapsible sidebar and mobile menu
- **Adaptive Layouts**: Screen-size appropriate layouts
- **Performance Optimized**: Fast loading on mobile networks

### PWA Features
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Full-screen mobile app experience
- **Fast Loading**: Optimized for mobile performance

## 🔐 Security Features

### Authentication Security
- **JWT Token Management**: Secure token storage and refresh
- **Route Protection**: Authenticated route guards
- **Session Timeout**: Automatic logout on inactivity
- **CSRF Protection**: Cross-site request forgery prevention

### Data Protection
- **Input Sanitization**: XSS prevention
- **Secure Headers**: Content Security Policy implementation
- **HTTPS Enforcement**: Secure data transmission
- **Privacy Controls**: User data management

## 🧪 Testing Strategy

### Unit Testing
- **Component Testing**: Individual component functionality
- **Hook Testing**: Custom hook behavior validation
- **Utility Testing**: Helper function verification

### Integration Testing
- **API Integration**: Service integration testing
- **User Flows**: Complete user journey testing
- **Authentication**: Login/logout flow testing

### E2E Testing
- **Critical Paths**: Document upload and chat functionality
- **Cross-Browser**: Multi-browser compatibility testing
- **Mobile Testing**: Mobile device testing

## 🚀 Performance Optimization

### Build Optimization
- **Code Splitting**: Lazy loading for better performance
- **Bundle Analysis**: Bundle size monitoring and optimization
- **Asset Optimization**: Image and file compression
- **Caching Strategy**: Efficient browser caching

### Runtime Performance
- **Virtual Scrolling**: Efficient large list rendering
- **Debounced Inputs**: Optimized user input handling
- **Lazy Loading**: On-demand resource loading
- **Memory Management**: Efficient memory usage patterns

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Write comprehensive tests
5. Follow React best practices
6. Maintain accessibility standards

### Code Standards
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Git Hooks**: Pre-commit validation