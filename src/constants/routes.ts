/**
 * Application Routes
 * Centralized route definitions
 */
export const ROUTES = {
  HOME: '/',
  MATCHES: '/matches/',
  INSIGHTS: '/insights/',
} as const;

/**
 * Route Names (for easier refactoring)
 */
export const ROUTE_NAMES = {
  HOME: 'home',
  MATCHES: 'matches',
  INSIGHTS: 'insights',
} as const;
