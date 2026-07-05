// src/services/auth.ts
// NOTE: currently unused (lib/auth.ts owns authentication via the Cognito
// SDK). Kept in sync with the arag-backend stack in case the app moves to
// the hosted-UI OIDC flow later.
export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_QpVn3NEVT",
  client_id: "3sh7r54dbj7u0ta95b8suqah49",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid email profile",
  post_logout_redirect_uri: window.location.origin,
};
