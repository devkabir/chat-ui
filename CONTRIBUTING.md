# Contributing to Chat UI

Thank you for your interest in contributing to Chat UI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/chat-ui.git
cd chat-ui

# Install dependencies
bun install

# Start development server
bun run dev
```

## 🔄 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 2. Make Changes
- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Test your changes thoroughly

### 3. Commit Changes
```bash
git add .
git commit -m "feat: add amazing new feature"
```

#### Commit Message Format
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

### 4. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── ChatHeader.vue
│   ├── ChatMessages.vue
│   ├── ChatInput.vue
│   └── MessageBubble.vue
├── services/           # API services
│   ├── llm.js         # LLM API integration
│   └── models.js      # Models API
├── utils/             # Utility functions
│   └── markdown.js    # Markdown processing
├── style.css          # Global styles
└── main.js           # App entry point
```

## 🧪 Testing

### Manual Testing
```bash
# Development server
bun run dev

# Production build
bun run build
bun run preview
```

### Testing Checklist
- [ ] UI responds correctly to user interactions
- [ ] API calls work with local LLM server
- [ ] Markdown rendering displays properly
- [ ] Math equations render correctly
- [ ] Code syntax highlighting works
- [ ] Streaming responses display in real-time
- [ ] Stop button cancels requests
- [ ] Responsive design works on different screen sizes

## 🎨 Code Style

### Vue Components
- Use Composition API for new components
- Keep components focused and single-purpose
- Use descriptive prop names and types
- Include JSDoc comments for complex props

### JavaScript
- Use modern ES6+ features
- Prefer `const` over `let` when possible
- Use meaningful variable and function names
- Keep functions small and focused

### CSS
- Use Tailwind CSS classes primarily
- Add custom CSS only when necessary
- Follow responsive design principles
- Use semantic class names for custom styles

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**: Browser, OS, Node.js version
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Console errors**: Any error messages

## 💡 Feature Requests

For feature requests, please provide:

1. **Use case**: Why is this feature needed?
2. **Description**: What should the feature do?
3. **Examples**: How would users interact with it?
4. **Alternatives**: Have you considered other solutions?

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional format
- [ ] Branch is up to date with main

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All existing functionality still works

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🔄 Release Process

Releases are automated via GitHub Actions:

1. **Create a tag**: `git tag v1.0.0 && git push origin v1.0.0`
2. **GitHub Action runs**: Builds and creates release
3. **Assets uploaded**: ZIP and tar.gz files
4. **Release notes**: Auto-generated from commits

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **README**: For setup and usage instructions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Chat UI! 🎉