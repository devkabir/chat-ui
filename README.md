# 🤖 Chat UI

![Build Status](https://github.com/YOUR_USERNAME/chat-ui/workflows/Build%20and%20Test/badge.svg)
![Release](https://github.com/YOUR_USERNAME/chat-ui/workflows/Build%20and%20Release/badge.svg)

A modern, full-featured web interface for chatting with local LLMs via OpenAI-compatible APIs.

## ✨ Features

- 🤖 **Local LLM Integration** - Connect to any OpenAI-compatible API
- 📡 **Real-time Streaming** - See responses as they're generated
- 📝 **Rich Markdown** - Full support for formatted text, code blocks, and tables
- 🧮 **Math Equations** - LaTeX/KaTeX rendering for mathematical expressions
- 🎨 **Syntax Highlighting** - 180+ programming languages supported
- 🛑 **Request Control** - Stop generation at any time
- 📱 **Responsive Design** - Full-width layout optimized for readability
- ⚡ **Fast & Modern** - Built with Vue 3 and Vite

## 🚀 Quick Start

### Option 1: Download Release
1. Go to [Releases](https://github.com/YOUR_USERNAME/chat-ui/releases)
2. Download the latest `chat-ui-vX.X.X.zip`
3. Extract and serve:
   ```bash
   python -m http.server 3000
   # or
   npx serve -s . -p 3000
   ```

### Option 2: Build from Source
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/chat-ui.git
cd chat-ui

# Install dependencies
bun install  # or npm install

# Development
bun run dev  # or npm run dev

# Production build
bun run build  # or npm run build
bun run preview  # or npm run preview
```

## ⚙️ Configuration

Update the API endpoint in `src/services/llm.js`:
```javascript
const API_URL = 'http://YOUR_LLM_SERVER:PORT/v1/chat/completions'
```

The application expects an OpenAI-compatible API with endpoints:
- `/v1/chat/completions` - For chat messages
- `/v1/models` - For available models

## 🏗️ Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## 📦 Deployment

### Static Hosting
Deploy the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Docker
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Releases

### Creating a Release
```bash
# Tag a new version
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Action will automatically:
- Build the application
- Create a GitHub release
- Upload build artifacts
- Generate release notes

### Release Assets
Each release includes:
- `chat-ui-vX.X.X.zip` - Ready-to-serve web application
- `chat-ui-vX.X.X.tar.gz` - Compressed archive
- Source code archives

## 🛠️ Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS
- **Markdown**: Marked.js with syntax highlighting
- **Math**: KaTeX for LaTeX equation rendering
- **Build**: Vite with optimized chunking
- **CI/CD**: GitHub Actions for automated builds and releases