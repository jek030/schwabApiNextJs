import { headers } from 'next/headers';

interface TokenData {
  access_token: string;
  expires_in: number;
  timestamp: number;
}

class TokenRefreshService {
  private static instance: TokenRefreshService;
  private tokenData: TokenData | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  
  private constructor() {}

  static getInstance(): TokenRefreshService {
    if (!TokenRefreshService.instance) {
      TokenRefreshService.instance = new TokenRefreshService();
    }
    return TokenRefreshService.instance;
  }

  async refreshToken() {
    const base64Credentials = Buffer.from(`${process.env.SCHWAB_CLIENT_ID!}:${process.env.SCHWAB_CLIENT_SECRET!}`).toString("base64");

    console.log("\n*****Schwab Client ID:" + process.env.SCHWAB_CLIENT_ID!);
    console.log("*****Schwab Client Secret:" + process.env.SCHWAB_CLIENT_SECRET!);
    console.log("*****Schwab Refresh Token:" + process.env.SCHWAB_REFRESH_TOKEN!);
    try {
      const response = await fetch('https://api.schwabapi.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${base64Credentials}`,
        },
        body: `grant_type=refresh_token&refresh_token=${process.env.SCHWAB_REFRESH_TOKEN!}`

      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      this.tokenData = {
        access_token: data.access_token,
        expires_in: data.expires_in,
        timestamp: Date.now(),
      };

      // Schedule next refresh 1 minute before expiration
      const refreshIn = (data.expires_in - 60) * 1000;
      this.scheduleRefresh(refreshIn);

      console.log("New Refresh Token:", data.refresh_token);
      console.log("New Access Token:", data.access_token);
      return this.tokenData.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  private scheduleRefresh(refreshIn: number) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshIn);
  }

  async getValidToken(): Promise<string> {
    if (!this.tokenData) {
      return this.refreshToken();
    }

    const expiresAt = this.tokenData.timestamp + (this.tokenData.expires_in * 1000);
    const now = Date.now();
    
    // Refresh if token will expire in less than 2 minutes
    if (expiresAt - now < 120000) {
      return this.refreshToken();
    }

    return this.tokenData.access_token;
  }

  // Clean up timer when service is destroyed
  cleanup() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
}

export const tokenService = TokenRefreshService.getInstance();