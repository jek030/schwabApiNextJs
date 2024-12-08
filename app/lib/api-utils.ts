interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 5000,
  } = config;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      if (!response.ok) {
        // Rate limit handling for CoinGecko
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status,
          await response.json().catch(() => null)
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff with jitter
        const delay = Math.min(
          Math.random() * (baseDelay * Math.pow(2, attempt)),
          maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
} 