const API_URL = 'http://192.168.0.138:1234/v1/chat/completions'

export async function sendMessage(messages, model = 'google/gemma-3-12b', temperature = 0.7) {
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
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}