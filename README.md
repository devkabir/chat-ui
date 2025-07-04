# 🤖 Chat UI

![Build Status](https://github.com/devkabir/chat-ui/workflows/Build%20and%20Test/badge.svg)
![Release](https://github.com/devkabir/chat-ui/workflows/Build%20and%20Release/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.x-green.svg)

A modern, full-featured web interface for chatting with local LLMs via OpenAI-compatible APIs. Built with Vue 3, featuring real-time streaming, rich markdown support, and a responsive design optimized for productivity.

## ✨ Features

### 🤖 **LLM Integration**
- **OpenAI-Compatible API** - Works with any local LLM server (Ollama, LM Studio, etc.)
- **Dynamic Model Loading** - Automatically fetches available models from `/v1/models`
- **Real-time Streaming** - See responses as they're generated token by token
- **Request Control** - Stop generation at any time with the stop button

### 📝 **Rich Content Support**
- **Markdown Rendering** - Full GitHub Flavored Markdown support
- **Syntax Highlighting** - 180+ programming languages with copy-to-clipboard
- **Math Equations** - LaTeX/KaTeX rendering for mathematical expressions
- **Tables** - Responsive table rendering with hover effects
- **Code Blocks** - Syntax-highlighted code with language detection

### 🎨 **User Experience**
- **Full-Width Design** - Optimized for readability and modern displays
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Dark Code Themes** - GitHub Dark theme for code blocks
- **Message Timestamps** - Track conversation timing
- **Connection Status** - Visual indicators for API connectivity

### ⚡ **Performance & Modern Stack**
- **Vue 3 Composition API** - Modern, reactive framework
- **Vite Build System** - Lightning-fast development and optimized builds
- **Tailwind CSS** - Utility-first styling with custom components
- **Component Architecture** - Modular, maintainable codebase

## 🚀 Quick Start

### Option 1: Download Pre-built Release
1. Go to [Releases](https://github.com/devkabir/chat-ui/releases)
2. Download the latest `chat-ui-vX.X.X.zip`
3. Extract and serve the files:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve -s . -p 3000
   
   # Using Bun
   bun --bun serve -p 3000 .
   ```
4. Open http://localhost:3000

### Option 2: Build from Source
```bash
# Clone repository
git clone https://github.com/devkabir/chat-ui.git
cd chat-ui

# Install dependencies (Bun recommended)
bun install  # or npm install

# Development server with hot reload
bun run dev  # or npm run dev

# Production build
bun run build  # or npm run build
bun run preview  # or npm run preview
```

## ⚙️ Configuration

### LLM Server Setup
The application expects an OpenAI-compatible API running locally. Popular options:

**Ollama:**
```bash
# Install and run Ollama
ollama serve
ollama run llama2  # or any model
```

**LM Studio:**
- Download from [LM Studio](https://lmstudio.ai/)
- Load a model and start the local server
- Default endpoint: `http://localhost:1234`

### API Endpoints Configuration
Update the endpoints in the source files if needed:

**Chat API** (`src/services/llm.js`):
```javascript
const API_URL = 'http://192.168.0.138:1234/v1/chat/completions'
```

**Models API** (`src/services/models.js`):
```javascript
const MODELS_API_URL = 'http://192.168.0.138:1234/v1/models'
```

### Required API Endpoints
Your LLM server must support:
- `GET /v1/models` - Returns available models
- `POST /v1/chat/completions` - Chat completions (streaming and non-streaming)

## 📁 Project Structure

```
chat-ui/
├── public/                 # Static assets
├── src/
│   ├── components/         # Vue components
│   │   ├── ChatHeader.vue     # Header with model info and status
│   │   ├── ChatMessages.vue   # Message list with auto-scroll
│   │   ├── ChatInput.vue      # Input area with controls
│   │   └── MessageBubble.vue  # Individual message rendering
│   ├── services/          # API services
│   │   ├── llm.js            # LLM API integration (streaming/non-streaming)
│   │   └── models.js         # Models API for dynamic loading
│   ├── utils/             # Utility functions
│   │   └── markdown.js       # Markdown processing with math/code support
│   ├── App.vue           # Main application component
│   ├── main.js           # Application entry point
│   └── style.css         # Global styles and imports
├── .github/workflows/     # GitHub Actions CI/CD
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🛠️ Development

### Prerequisites
- **Bun** (recommended) or Node.js 18+
- **Git**
- **Local LLM Server** (Ollama, LM Studio, etc.)

### Development Workflow
```bash
# Install dependencies
bun install

# Start development server (hot reload enabled)
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Lint and format (if configured)
bun run lint
```

### Component Development
- Use **Vue 3 Composition API** for new components
- Follow **single responsibility principle**
- Include **TypeScript-style prop definitions**
- Add **JSDoc comments** for complex functions

### Styling Guidelines
- **Tailwind CSS** for styling (utility-first)
- **Custom CSS** only when Tailwind is insufficient
- **Responsive design** using Tailwind breakpoints
- **Dark mode** considerations for code blocks

## 🧪 Testing

### Manual Testing Checklist
- [ ] Connect to local LLM server
- [ ] Send messages and receive responses
- [ ] Test streaming vs non-streaming modes
- [ ] Verify markdown rendering (headers, lists, links)
- [ ] Test code block syntax highlighting
- [ ] Verify math equation rendering
- [ ] Test table rendering
- [ ] Try stop button during generation
- [ ] Test on different screen sizes
- [ ] Verify model dropdown loads correctly

### API Testing
```bash
# Test your LLM server endpoints
curl http://localhost:1234/v1/models

curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-name",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false
  }'
```

## 📦 Deployment

### Static Hosting Services
Deploy the `dist/` folder to:
- **Netlify**: Drag and drop or Git integration
- **Vercel**: Import GitHub repository
- **GitHub Pages**: Use GitHub Actions workflow
- **AWS S3 + CloudFront**: Static website hosting

### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t chat-ui .
docker run -p 8080:80 chat-ui
```

### Server Deployment
```bash
# Using PM2 for Node.js
npm install -g pm2 serve
pm2 start serve --name chat-ui -- -s dist -p 3000

# Using systemd service
sudo cp chat-ui.service /etc/systemd/system/
sudo systemctl enable chat-ui
sudo systemctl start chat-ui
```

## 🔄 Release Management

### Automated Releases
Releases are automated via GitHub Actions:

```bash
# Create and push a new tag
git tag v1.0.0
git push origin v1.0.0
```

**The workflow automatically:**
- ✅ Builds the application with Bun
- ✅ Creates optimized production bundle
- ✅ Generates ZIP and tar.gz archives
- ✅ Creates GitHub release with auto-generated notes
- ✅ Uploads downloadable assets

### Release Assets
Each release includes:
- **`chat-ui-vX.X.X.zip`** - Ready-to-serve web application
- **`chat-ui-vX.X.X.tar.gz`** - Compressed archive for Unix systems
- **Source code** - GitHub-generated source archives

### Version Strategy
- **Major** (v1.0.0): Breaking changes, new major features
- **Minor** (v1.1.0): New features, backwards compatible
- **Patch** (v1.1.1): Bug fixes, small improvements

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Contributing Steps
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Setup for Contributors
```bash
# Fork and clone your fork
git clone https://github.com/devkabir/chat-ui.git
cd chat-ui

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/chat-ui.git

# Install dependencies
bun install

# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and test
bun run dev

# Commit and push
git commit -m "feat: add my new feature"
git push origin feature/my-new-feature
```

## 🛠️ Tech Stack & Dependencies

### Core Framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Rich Content Rendering
- **[Marked](https://marked.js.org/)** - Markdown parser and compiler
- **[Highlight.js](https://highlightjs.org/)** - Syntax highlighting for code blocks
- **[KaTeX](https://katex.org/)** - Fast math typesetting for the web
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - XSS sanitizer for HTML

### Build & Development
- **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime (recommended)
- **[PostCSS](https://postcss.org/)** - CSS post-processing
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixing

### API Integration
- **Fetch API** - Native browser HTTP client
- **AbortController** - Request cancellation support
- **Server-Sent Events** - Real-time streaming support

## 🔍 Troubleshooting

### Common Issues

**CORS Errors:**
```bash
# Don't open index.html directly in browser
# Use a development server instead:
bun run dev
```

**API Connection Failed:**
- Verify your LLM server is running
- Check the API endpoints in configuration
- Ensure CORS is enabled on your LLM server

**Build Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
bun install
bun run build
```

**Styling Issues:**
- Ensure Tailwind CSS is properly imported
- Check for conflicting CSS rules
- Verify build process includes CSS processing

### Performance Tips
- Use streaming mode for better perceived performance
- Optimize images and assets for faster loading
- Consider enabling gzip compression on your server
- Monitor bundle size and use code splitting if needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**MIT License Summary:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ No warranty
- ❌ No liability

## 🙏 Acknowledgments

- **Vue.js team** for the excellent framework
- **Vite team** for the blazing fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Open source community** for the amazing libraries and tools

## 📞 Support & Community

- **GitHub Issues**: [Report bugs and request features](https://github.com/devkabir/chat-ui/issues)
- **GitHub Discussions**: [Community discussions and Q&A](https://github.com/devkabir/chat-ui/discussions)
- **Contributing Guide**: [How to contribute](CONTRIBUTING.md)

---

**Star ⭐ this repository if you find it useful!**