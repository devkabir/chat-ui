const MODELS_API_URL = 'http://192.168.0.138:1234/v1/models'

export async function fetchAvailableModels() {
  try {
    const response = await fetch(MODELS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the API response to a more usable format
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(model => ({
        id: model.id,
        name: model.id,
        object: model.object,
        created: model.created,
        owned_by: model.owned_by || 'unknown'
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching models:', error)
    // Return fallback models if API fails
    return [
      {
        id: 'google/gemma-3-12b',
        name: 'Gemma 3 12B',
        object: 'model',
        owned_by: 'google'
      }
    ]
  }
}