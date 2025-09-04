// Simple API request helper for fetch calls
export async function apiRequest(method, url, body, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response;
}
