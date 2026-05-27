// Enhanced Gemini service with timeout, retry, and better error handling
const fetchWithTimeout = (url, options, timeout = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  try {
    return await fetchWithTimeout(url, options);
  } catch (error) {
    if (retries === 0) throw error;
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Exponential backoff
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
};

export async function sendGeminiChat(payload) {
  try {
    const response = await fetchWithRetry(
      '/api/gemini',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      3, // max retries
      1000 // initial delay
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('Gemini service error:', error);
    
    // Throw a more user-friendly error
    throw new Error(
      error.message.includes('timeout') 
        ? 'Request timed out. Please try again.' 
        : 'Failed to connect to Gemini service. Please check your connection.'
    );
  }
}