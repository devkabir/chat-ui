// Web search service using DuckDuckGo API or similar
const SEARCH_API_BASE = 'https://api.duckduckgo.com/'

export async function searchWeb(query, maxResults = 5) {
  try {
    // Using DuckDuckGo Instant Answer API
    const response = await fetch(`${SEARCH_API_BASE}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`)
    
    if (!response.ok) {
      throw new Error('Search request failed')
    }
    
    const data = await response.json()
    
    const results = []
    
    // Add abstract if available
    if (data.Abstract && data.Abstract.length > 0) {
      results.push({
        title: data.Heading || 'Overview',
        snippet: data.Abstract,
        url: data.AbstractURL || '',
        source: data.AbstractSource || 'DuckDuckGo',
        type: 'abstract'
      })
    }
    
    // Add related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, maxResults - results.length).forEach(topic => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            snippet: topic.Text,
            url: topic.FirstURL,
            source: 'DuckDuckGo',
            type: 'related'
          })
        }
      })
    }
    
    // Add answer if available
    if (data.Answer && data.Answer.length > 0) {
      results.unshift({
        title: 'Quick Answer',
        snippet: data.Answer,
        url: data.AnswerURL || '',
        source: data.AnswerType || 'DuckDuckGo',
        type: 'answer'
      })
    }
    
    return {
      query,
      results,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('Web search error:', error)
    return {
      query,
      results: [],
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Alternative search using a CORS proxy for more comprehensive results
export async function searchWebFallback(query, maxResults = 5) {
  try {
    // Using a public search API or scraping service
    const corsProxy = 'https://api.allorigins.win/raw?url='
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    
    const response = await fetch(corsProxy + encodeURIComponent(searchUrl))
    
    if (!response.ok) {
      throw new Error('Fallback search failed')
    }
    
    const html = await response.text()
    
    // Parse HTML results (basic parsing)
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const results = []
    const resultElements = doc.querySelectorAll('.result')
    
    for (let i = 0; i < Math.min(resultElements.length, maxResults); i++) {
      const element = resultElements[i]
      const titleElement = element.querySelector('.result__title a')
      const snippetElement = element.querySelector('.result__snippet')
      const urlElement = element.querySelector('.result__url')
      
      if (titleElement && snippetElement) {
        results.push({
          title: titleElement.textContent.trim(),
          snippet: snippetElement.textContent.trim(),
          url: titleElement.href || urlElement?.textContent?.trim() || '',
          source: 'DuckDuckGo Search',
          type: 'search'
        })
      }
    }
    
    return {
      query,
      results,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('Fallback search error:', error)
    return {
      query,
      results: [],
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Mock search for development/demo purposes
export function searchWebMock(query, maxResults = 5) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults = [
        {
          title: `Understanding ${query}`,
          snippet: `This is a comprehensive overview of ${query}, covering the key concepts and important information you need to know.`,
          url: `https://example.com/search/${encodeURIComponent(query)}`,
          source: 'Example.com',
          type: 'search'
        },
        {
          title: `${query} - Definition and Examples`,
          snippet: `Learn about ${query} with practical examples and detailed explanations. Get started with the basics and advance to complex topics.`,
          url: `https://wiki.example.com/${encodeURIComponent(query)}`,
          source: 'ExampleWiki',
          type: 'search'
        },
        {
          title: `Latest News about ${query}`,
          snippet: `Recent developments and news related to ${query}. Stay updated with the latest trends and information.`,
          url: `https://news.example.com/topics/${encodeURIComponent(query)}`,
          source: 'Example News',
          type: 'news'
        }
      ]
      
      resolve({
        query,
        results: mockResults.slice(0, maxResults),
        timestamp: new Date().toISOString()
      })
    }, 1000) // Simulate network delay
  })
}