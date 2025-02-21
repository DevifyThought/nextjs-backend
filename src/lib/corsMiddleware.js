export function corsMiddleware() {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow all origins (change to specific origin if needed)
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
}
