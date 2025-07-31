import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  type InitiateAuthCommandOutput,
  type SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";

const client = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

const CLIENT_ID = "7qu59bcn8kbc89ct9p74pjcqh9";

// ✨ ENHANCED: Extended response types
export type LoginResponse = {
  success: boolean;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  needsConfirmation?: boolean; // ✨ NEW: Flag for unconfirmed users
};

export type SignupResponse = {
  success: boolean;
  userSub?: string;
  error?: string;
  needsConfirmation?: boolean;
  existingUnconfirmed?: boolean; // ✨ NEW: Flag for existing unconfirmed users
};

export type ConfirmationResponse = {
  success: boolean;
  error?: string;
};

export class CognitoAuth {
  // ✨ ENHANCED: Login method with better error handling
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response: InitiateAuthCommandOutput = await client.send(command);

      const auth = response.AuthenticationResult;
      if (auth?.IdToken && auth.AccessToken && auth.RefreshToken) {
        localStorage.setItem("id_token", auth.IdToken);
        localStorage.setItem("access_token", auth.AccessToken);
        localStorage.setItem("refresh_token", auth.RefreshToken);

        return {
          success: true,
          idToken: auth.IdToken,
          accessToken: auth.AccessToken,
          refreshToken: auth.RefreshToken,
        };
      }

      return { success: false, error: "Authentication failed" };
    } catch (error: any) {
      console.error("Login error:", error);

      // ✨ ENHANCED: Handle specific login errors
      let errorMessage = "Login failed";

      if (error.name === "UserNotConfirmedException") {
        errorMessage = "UserNotConfirmedException: Please confirm your email address to complete signup.";
        return {
          success: false,
          error: errorMessage,
          needsConfirmation: true,
        };
      } else if (error.name === "NotAuthorizedException") {
        errorMessage = "Invalid email or password";
      } else if (error.name === "UserNotFoundException") {
        errorMessage = "No account found with this email address";
      } else if (error.name === "TooManyRequestsException") {
        errorMessage = "Too many login attempts. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ✨ ENHANCED: Signup method with better error handling
  async signup(email: string, password: string): Promise<SignupResponse> {
    try {
      const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
        ],
      });

      const response: SignUpCommandOutput = await client.send(command);

      if (response.UserSub) {
        return {
          success: true,
          userSub: response.UserSub,
          needsConfirmation: !response.UserConfirmed,
        };
      }

      return { success: false, error: "Signup failed" };
    } catch (error: any) {
      console.error("Signup error:", error);

      // Handle specific Cognito errors
      let errorMessage = "Signup failed";

      if (error.name === "UsernameExistsException") {
        // ✨ ENHANCED: Better handling for existing users
        errorMessage = "An account with this email already exists. If you haven't confirmed your email yet, please check your inbox or try signing in.";
        return {
          success: false,
          error: errorMessage,
          existingUnconfirmed: true, // Assume they might need to confirm
        };
      } else if (error.name === "InvalidPasswordException") {
        errorMessage = "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, and numbers.";
      } else if (error.name === "InvalidParameterException") {
        errorMessage = "Invalid email or password format";
      } else if (error.name === "TooManyRequestsException") {
        errorMessage = "Too many requests. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ✨ KEEP: Confirm signup method (unchanged)
  async confirmSignup(email: string, confirmationCode: string): Promise<ConfirmationResponse> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,
      });

      await client.send(command);

      return { success: true };
    } catch (error: any) {
      console.error("Confirm signup error:", error);

      let errorMessage = "Confirmation failed";

      if (error.name === "CodeMismatchException") {
        errorMessage = "Invalid confirmation code";
      } else if (error.name === "ExpiredCodeException") {
        errorMessage = "Confirmation code has expired";
      } else if (error.name === "LimitExceededException") {
        errorMessage = "Too many attempts. Please try again later";
      } else if (error.name === "UserNotFoundException") {
        errorMessage = "User not found";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ✨ KEEP: Resend confirmation code method (unchanged)
  async resendConfirmation(email: string): Promise<ConfirmationResponse> {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: CLIENT_ID,
        Username: email,
      });

      await client.send(command);

      return { success: true };
    } catch (error: any) {
      console.error("Resend confirmation error:", error);

      let errorMessage = "Failed to resend confirmation code";

      if (error.name === "LimitExceededException") {
        errorMessage = "Too many attempts. Please try again later";
      } else if (error.name === "InvalidParameterException") {
        errorMessage = "Invalid email address";
      } else if (error.name === "UserNotFoundException") {
        errorMessage = "User not found";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ✨ KEEP: Forgot password method (unchanged)
  async forgotPassword(email: string): Promise<ConfirmationResponse> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
      });

      await client.send(command);

      return { success: true };
    } catch (error: any) {
      console.error("Forgot password error:", error);

      let errorMessage = "Failed to send reset email";

      if (error.name === "UserNotFoundException") {
        errorMessage = "No account found with this email address";
      } else if (error.name === "LimitExceededException") {
        errorMessage = "Too many attempts. Please try again later";
      } else if (error.name === "InvalidParameterException") {
        errorMessage = "Invalid email address";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ✨ KEEP: Reset password confirmation method (unchanged)
  async resetPassword(email: string, confirmationCode: string, newPassword: string): Promise<ConfirmationResponse> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
      });

      await client.send(command);

      return { success: true };
    } catch (error: any) {
      console.error("Reset password error:", error);

      let errorMessage = "Failed to reset password";

      if (error.name === "CodeMismatchException") {
        errorMessage = "Invalid confirmation code";
      } else if (error.name === "ExpiredCodeException") {
        errorMessage = "Confirmation code has expired";
      } else if (error.name === "InvalidPasswordException") {
        errorMessage = "Password does not meet requirements";
      } else if (error.name === "LimitExceededException") {
        errorMessage = "Too many attempts. Please try again later";
      } else if (error.name === "UserNotFoundException") {
        errorMessage = "User not found";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ✨ KEEP: Other methods (unchanged)
  logout(): void {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  getIdToken(): string | null {
    return localStorage.getItem("id_token");
  }

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  isAuthenticated(): boolean {
    const token = this.getIdToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getUser(): { profile: { email: string }; sub: string; username: string } | null {
    const token = this.getIdToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        profile: {
          email: decoded.email,
        },
        sub: decoded.sub,
        username: decoded["cognito:username"],
      };
    } catch {
      return null;
    }
  }
}

export const auth = new CognitoAuth();