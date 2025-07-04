const API_URL = 'http://192.168.0.138:1234/v1/chat/completions'

export async function sendMessage(messages, model = 'google/gemma-3-12b', temperature = 0.7, abortSignal = null) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: -1,
        stream: false
      }),
      signal: abortSignal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled')
    }
    console.error('Error sending message:', error)
    throw error
  }
}

export async function sendMessageStream(messages, model = 'google/gemma-3-12b', temperature = 0.7, onToken, abortSignal = null) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: -1,
        stream: true
      }),
      signal: abortSignal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6)
            
            if (data === '[DONE]') {
              return
            }
            
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              
              if (content) {
                onToken(content)
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled')
    }
    console.error('Error sending stream message:', error)
    throw error
  }
}