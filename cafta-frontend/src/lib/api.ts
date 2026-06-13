/**
 * API utility functions for frontend-backend communication
 * Handles environment-specific configuration and fallback behavior
 */

 /**
  * Gets the API base URL from environment variables with intelligent fallback
  *
  * Priority:
  * 1. NEXT_PUBLIC_API_URL if explicitly set
  * 2. In development: http://localhost:4000 (local backend)
  * 3. In production: relative URLs (assuming same-origin deployment)
  *
  * @returns {string} API base URL without trailing slash
  */
 export function getApiBaseUrl(): string {
   // Check for explicitly set API URL
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   if (apiUrl) {
     // Remove trailing slash if present
     return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
   }

   // Fallback based on environment
   if (process.env.NODE_ENV === 'production') {
     // In production, if not explicitly set, use relative URLs
     // This works when frontend and backend are deployed to the same domain
     // or when using a reverse proxy
     return '';
   }

   // Development fallback - assume backend is running locally
   return 'http://localhost:4000';
 }

 /**
  * Makes a fetch request to the backend API
  * @param endpoint - API endpoint (e.g., '/pesquisas')
  * @param options - Fetch options
  * @returns Promise<Response>
  */
 export async function apiFetch(
   endpoint: string,
   options: RequestInit = {}
 ): Promise<Response> {
   const baseUrl = getApiBaseUrl();
   const url = `${baseUrl}${endpoint}`;

   // Ensure headers are set for JSON requests
   const headers = new Headers(options.headers ?? {});

   // If sending JSON data, set Content-Type
   if (
     options.body &&
     !(options.body instanceof FormData) &&
     !(options.body instanceof URLSearchParams) &&
     typeof options.body !== 'string'
   ) {
     if (!headers.has('Content-Type')) {
       headers.set('Content-Type', 'application/json');
     }

     // Convert body to JSON if it's not already a string
     if (typeof options.body !== 'string') {
       options.body = JSON.stringify(options.body);
     }
   }

   // Add credentials for cookies if needed (for auth)
   // Only add credentials for same-origin requests to avoid security issues
   const isSameOrigin = !getApiBaseUrl() ||
     window.location.origin === getApiBaseUrl();

   if (isSameOrigin && !headers.has('Credentials') && !options.credentials) {
     options.credentials = 'include';
   }

   const fetchOptions: RequestInit = {
     ...options,
     headers,
   };

   return fetch(url, fetchOptions);
 }

 /**
  * Helper functions for common API methods
  */
 export const api = {
   get: (endpoint: string, options: RequestInit = {}) =>
     apiFetch(endpoint, { ...options, method: 'GET' }),

   post: (endpoint: string, options: RequestInit = {}) =>
     apiFetch(endpoint, { ...options, method: 'POST' }),

   put: (endpoint: string, options: RequestInit = {}) =>
     apiFetch(endpoint, { ...options, method: 'PUT' }),

   patch: (endpoint: string, options: RequestInit = {}) =>
     apiFetch(endpoint, { ...options, method: 'PATCH' }),

   delete: (endpoint: string, options: RequestInit = {}) =>
     apiFetch(endpoint, { ...options, method: 'DELETE' }),
 };