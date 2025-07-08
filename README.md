# 🤖 Chat UI

![Build Status](https://github.com/devkabir/chat-ui/workflows/Build%20and%20Test/badge.svg)
![Release](https://github.com/devkabir/chat-ui/workflows/Build%20and%20Release/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.x-green.svg)

A modern web interface for chatting with local LLMs using OpenAI-compatible APIs. Built with Vue 3, it includes real-time streaming, rich markdown support, and a clean design that works on all devices.

## ✨ Features

### 🤖 **Chat with Local LLMs**
- **OpenAI-Compatible API** - Works with Ollama, LM Studio, and other local LLM servers
- **Model Selection** - Choose from available models with automatic loading
- **Real-time Streaming** - See responses as they are generated
- **Stop Button** - Cancel generation at any time
- **Temperature Control** - Adjust creativity with manual or automatic temperature settings

### 📝 **Rich Message Display**
- **Markdown Support** - Full GitHub Flavored Markdown rendering
- **Code Highlighting** - Syntax highlighting for 180+ programming languages
- **Copy Code Blocks** - Easy copy-to-clipboard functionality
- **Responsive Tables** - Clean table display with hover effects
- **Message History** - Navigate through previous messages with arrow keys

### 🎨 **User-Friendly Interface**
- **Clean Design** - Modern, easy-to-use interface
- **Works on All Devices** - Responsive design for desktop, tablet, and mobile
- **Connection Status** - Visual indicator showing API connection status
- **Conversation Starters** - Pre-made prompts to get started quickly
- **Personal Prompts** - Add your own prompts via GitHub Gist

### ⚡ **Modern Technology**
- **Vue 3** - Latest Vue.js framework with Composition API
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Auto-scroll** - Messages automatically scroll to show latest content

## 🚀 Quick Start

### Option 1: Download Pre-built Release
1. Visit the [Releases page](https://github.com/devkabir/chat-ui/releases)
2. Download the latest `chat-ui-vX.X.X.zip` file
3. Extract the files to a folder
4. Serve the files using any web server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve -s . -p 3000
   
   # Using Bun
   bun --bun serve -p 3000 .
   ```
5. Open http://localhost:3000 in your browser

### Option 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/devkabir/chat-ui.git
cd chat-ui

# Install dependencies (Bun is recommended)
bun install  # or npm install

# Start development server
bun run dev  # or npm run dev

# Build for production
bun run build  # or npm run build
bun run preview  # or npm run preview
```

## ⚙️ Configuration

### Setting Up Your LLM Server
You need an OpenAI-compatible API server running locally. Here are popular options:

**Ollama (Recommended):**
```bash
# Install and run Ollama
ollama serve
ollama run llama2  # or any model you want
```

**LM Studio:**
- Download from [LM Studio](https://lmstudio.ai/)
- Load a model and start the local server
- Default endpoint: `http://localhost:1234`

### API Configuration
The app uses environment variables for API endpoints. You can set them in a `.env` file:

```bash
# .env file (optional)
VITE_API_BASE_URL=http://localhost:1234
```

If not set, it defaults to `http://localhost:1234`.

### Required API Endpoints
Your LLM server must support these endpoints:
- `GET /v1/models` - Returns list of available models
- `POST /v1/chat/completions` - Chat completions (with streaming support)

## 📁 Project Structure

```
chat-ui/
├── public/                 # Static files
├── src/
│   ├── components/         # Vue components
│   │   ├── ChatHeader.vue     # Top bar with model info and status
│   │   ├── ChatMessages.vue   # Message list with conversation starters
│   │   ├── ChatInput.vue      # Input area with model selection and controls
│   │   └── MessageBubble.vue  # Individual message display
│   ├── services/          # API services
│   │   ├── llm.js            # LLM API calls (streaming and non-streaming)
│   │   └── models.js         # Model list API calls
│   ├── utils/             # Helper functions
│   │   └── markdown.js       # Markdown processing with syntax highlighting
│   ├── views/             # Page components
│   │   └── ChatView.vue      # Main chat page
│   ├── data/              # Static data
│   │   └── conversationStarters.json  # Pre-made conversation prompts
│   ├── App.vue           # Main app component
│   ├── main.js           # App entry point
│   └── style.css         # Global styles
├── .github/workflows/     # GitHub Actions for deployment
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite build configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🛠️ Development

### Prerequisites
- **Bun** (recommended) or Node.js 18+
- **Git**
- **Local LLM Server** (Ollama, LM Studio, etc.)

### Development Commands
```bash
# Install dependencies
bun install

# Start development server (with hot reload)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Code Guidelines
- Use **Vue 3 Composition API** for components
- Follow **single responsibility principle**
- Use **proper prop definitions**
- Add **comments** for complex logic

### Styling
- **Tailwind CSS** for all styling
- **Responsive design** using Tailwind breakpoints
- **Custom CSS** only when absolutely necessary

## 🧪 Testing

### Manual Testing Checklist
- [ ] Connect to local LLM server
- [ ] Send messages and receive responses
- [ ] Test streaming and non-streaming modes
- [ ] Check markdown rendering (headers, lists, links)
- [ ] Test code block syntax highlighting and copy function
- [ ] Test table rendering
- [ ] Try stop button during message generation
- [ ] Test model selection dropdown
- [ ] Test temperature controls (manual and auto)
- [ ] Test conversation starters
- [ ] Test on different screen sizes
- [ ] Test message history navigation with arrow keys

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
Deploy the `dist/` folder to any static hosting service:
- **Netlify**: Drag and drop or connect to Git
- **Vercel**: Import GitHub repository
- **GitHub Pages**: Use included GitHub Actions workflow
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

### Simple Server Deployment
```bash
# Using any static file server
npm install -g serve
serve -s dist -p 3000
```

## 🔄 Release Management

### Automated Releases
Releases are created automatically using GitHub Actions:

```bash
# Create and push a new tag
git tag v1.0.0
git push origin v1.0.0
```

**The workflow automatically:**
- ✅ Builds the application with Bun
- ✅ Creates production bundle
- ✅ Creates ZIP and tar.gz archives
- ✅ Creates GitHub release with notes
- ✅ Uploads downloadable files

### Release Files
Each release includes:
- **`chat-ui-vX.X.X.zip`** - Ready-to-use web application
- **`chat-ui-vX.X.X.tar.gz`** - Compressed archive
- **Source code** - GitHub-generated source files

### Version Numbers
- **Major** (v1.0.0): Breaking changes or major new features
- **Minor** (v1.1.0): New features, backwards compatible
- **Patch** (v1.1.1): Bug fixes and small improvements

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Make** your changes
4. **Test** your changes
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/new-feature`
7. **Open** a Pull Request

### Development Setup for Contributors
```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/chat-ui.git
cd chat-ui

# Install dependencies
bun install

# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and test
bun run dev

# Commit and push
git commit -m "Add my new feature"
git push origin feature/my-new-feature
```

## 🛠️ Tech Stack & Dependencies

### Core Framework
- **[Vue 3](https://vuejs.org/)** - JavaScript framework
- **[Vite](https://vitejs.dev/)** - Build tool and development server
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework

### Content Rendering
- **[Marked](https://marked.js.org/)** - Markdown parser
- **[Highlight.js](https://highlightjs.org/)** - Code syntax highlighting
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - HTML sanitizer for security

### Build Tools
- **[Bun](https://bun.sh/)** - JavaScript runtime (recommended)
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixes

### API Features
- **Fetch API** - HTTP requests
- **AbortController** - Request cancellation
- **Streaming** - Real-time response streaming

## 🔍 Troubleshooting

### Common Issues

**CORS Errors:**
```bash
# Don't open index.html directly in browser
# Use a development server instead:
bun run dev
```

**API Connection Failed:**
- Make sure your LLM server is running
- Check the API endpoint in your environment variables
- Ensure CORS is enabled on your LLM server

**Build Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
bun install
bun run build
```

**Styling Issues:**
- Make sure Tailwind CSS is properly imported
- Check for conflicting CSS rules
- Verify build process includes CSS processing

### Performance Tips
- Use streaming mode for better user experience
- Enable gzip compression on your server
- Monitor bundle size
- Optimize images and assets

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**MIT License allows:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ No warranty
- ❌ No liability

## 🙏 Acknowledgments

- **Vue.js team** for the excellent framework
- **Vite team** for the fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Open source community** for the amazing libraries and tools

## 📞 Support & Community

- **GitHub Issues**: [Report bugs and request features](https://github.com/devkabir/chat-ui/issues)
- **GitHub Discussions**: [Community discussions and Q&A](https://github.com/devkabir/chat-ui/discussions)

---

**Star ⭐ this repository if you find it useful!**