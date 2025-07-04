import { marked } from 'marked'
import hljs from 'highlight.js'
import katex from 'katex'
import DOMPurify from 'dompurify'

// Custom renderer for marked
const renderer = new marked.Renderer()

// Custom code block renderer with syntax highlighting
renderer.code = function(code, language) {
  const validLang = language && hljs.getLanguage(language) ? language : 'plaintext'
  const highlighted = hljs.highlight(code, { language: validLang }).value
  
  return `
    <div class="code-block-container relative group">
      <div class="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
        <span class="text-sm font-medium">${validLang}</span>
        <button class="copy-btn opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" 
                onclick="copyCode(this)" 
                data-code="${encodeURIComponent(code)}">
          Copy
        </button>
      </div>
      <pre class="hljs bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto"><code class="language-${validLang}">${highlighted}</code></pre>
    </div>
  `
}

// Custom inline code renderer
renderer.codespan = function(code) {
  return `<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">${code}</code>`
}

// Custom table renderer
renderer.table = function(header, body) {
  return `
    <div class="table-container overflow-x-auto my-4">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead class="bg-gray-50">
          ${header}
        </thead>
        <tbody class="divide-y divide-gray-200">
          ${body}
        </tbody>
      </table>
    </div>
  `
}

renderer.tablerow = function(content) {
  return `<tr class="hover:bg-gray-50">${content}</tr>`
}

renderer.tablecell = function(content, flags) {
  const type = flags.header ? 'th' : 'td'
  const className = flags.header 
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    : 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  
  return `<${type} class="${className}">${content}</${type}>`
}

// Custom blockquote renderer
renderer.blockquote = function(quote) {
  return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">${quote}</blockquote>`
}

// Custom list renderers
renderer.list = function(body, ordered) {
  const type = ordered ? 'ol' : 'ul'
  const className = ordered 
    ? 'list-decimal list-inside space-y-2 my-4 ml-4'
    : 'list-disc list-inside space-y-2 my-4 ml-4'
  
  return `<${type} class="${className}">${body}</${type}>`
}

renderer.listitem = function(text) {
  return `<li class="text-gray-700">${text}</li>`
}

// Configure marked with custom renderer
marked.setOptions({
  renderer: renderer,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  gfm: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

// Math rendering function
function renderMath(text) {
  // Store code blocks to prevent math processing inside them
  const codeBlocks = []
  const codeBlockPlaceholders = []
  
  // Extract code blocks first
  text = text.replace(/```[\s\S]*?```/g, (match, index) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
    codeBlocks.push(match)
    codeBlockPlaceholders.push(placeholder)
    return placeholder
  })
  
  // Extract inline code spans
  text = text.replace(/`[^`]+`/g, (match, index) => {
    const placeholder = `__INLINE_CODE_${codeBlocks.length}__`
    codeBlocks.push(match)
    codeBlockPlaceholders.push(placeholder)
    return placeholder
  })
  
  // Handle block math ($$...$$)
  text = text.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        output: 'html',
        strict: false
      })
    } catch (error) {
      return `<span class="text-red-500">Math Error: ${error.message}</span>`
    }
  })
  
  // Handle inline math ($...$) - but not inside code
  text = text.replace(/\$([^$]+)\$/g, (match, math) => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
        output: 'html',
        strict: false
      })
    } catch (error) {
      return `<span class="text-red-500">Math Error: ${error.message}</span>`
    }
  })
  
  // Restore code blocks
  codeBlockPlaceholders.forEach((placeholder, index) => {
    text = text.replace(placeholder, codeBlocks[index])
  })
  
  return text
}

// Main markdown processing function
export function processMarkdown(text) {
  // First render math equations
  const mathProcessed = renderMath(text)
  
  // Then process markdown
  const htmlContent = marked(mathProcessed)
  
  // Sanitize the HTML to prevent XSS
  const cleanHtml = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote',
      'code', 'pre',
      'a', 'img',
      'strong', 'em', 'u', 's', 'del',
      'span', 'div',
      'button'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title',
      'class', 'id',
      'onclick', 'data-code'
    ]
  })
  
  return cleanHtml
}

// Global function for copy functionality
if (typeof window !== 'undefined') {
  window.copyCode = function(button) {
    const code = decodeURIComponent(button.getAttribute('data-code'))
    navigator.clipboard.writeText(code).then(() => {
      const originalText = button.textContent
      button.textContent = 'Copied!'
      button.classList.add('bg-green-600')
      setTimeout(() => {
        button.textContent = originalText
        button.classList.remove('bg-green-600')
      }, 2000)
    }).catch(err => {
      console.error('Failed to copy code:', err)
    })
  }
}