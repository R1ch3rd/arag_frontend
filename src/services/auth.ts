// src/config/auth.ts
export const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_exaH3lVmo",
    client_id: "7qu59bcn8kbc89ct9p74pjcqh9",
    redirect_uri: window.location.origin, // This will be your frontend URL, e.g., http://localhost:5173
    response_type: "code",
    scope: "openid email profile", // Basic scopes needed
    post_logout_redirect_uri: window.location.origin, // Where to redirect after logout
  };