/**
 * Shared code between frontend and backend
 * Useful to share types between frontend and backend
 * and/or small pure JS functions that can be used on both frontend and backend
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
  timestamp?: string;
  environment?: string;
}
