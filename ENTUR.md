Benefits of routing through your backend:

  1. Security & Control
    - You control the API calls and can add authentication/rate limiting
    - You can monitor and log all requests
    - Protects against abuse of the Entur API
  2. API Key Management
    - Keep your Entur client credentials server-side only
    - No exposure of API endpoints in client code
    - Easier to update/rotate credentials
  3. Flexibility
    - You can cache results to improve performance
    - Add your own business logic (filtering, sorting, etc.)
    - Combine data from multiple sources if needed
    - Transform the data format to suit your needs
  4. Cost Control
    - Track and limit API usage per user
    - Implement your own rate limiting
    - Reduce direct calls to external APIs
  5. Better Error Handling
    - Provide consistent error messages
    - Handle Entur API downtime gracefully
    - Add fallback mechanisms

  Recommended Architecture:

  Frontend (Next.js)
      ↓
  Your Backend API (Node.js/Express or Next.js API routes)
      ↓
  Entur API

  You should create backend endpoints like:
  - POST /api/journey/search - Search for journeys
  - GET /api/location/autocomplete?query=Oslo - Location autocomplete
  - GET /api/location/reverse?lat=X&lon=Y - Reverse geocoding

  Would you like me to help you:
  1. Create these backend API routes?
  2. Update the frontend to call your backend instead of Entur directly?
