/**
 * Authentication Service (Client-side JWT management)
 * Practical 7: Authentication and Middleware Pipeline
 */

const AUTH_STORAGE_KEY = 'react_portfolio_auth_user';
const TOKEN_STORAGE_KEY = 'react_portfolio_jwt_token';

export const authService = {
  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Save session on register or login
   */
  saveSession(token, user) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  /**
   * Clear session on logout
   */
  logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Parse and decode JWT payload for client visualization
   */
  decodeToken(token) {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }
};
