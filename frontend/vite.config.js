import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  server: {
    proxy: {
      '/listings': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/signup': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/me': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
    }
  }
}