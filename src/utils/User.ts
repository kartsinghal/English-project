// src/entities/User.ts
import { api } from "@/lib/api"; // <-- make sure you have an axios instance or fetch wrapper here

// User data structure
export interface IUser {
  email: string;
  username: string;
  avatar_url?: string;
  coins?: number;
  total_points?: number;
  current_streak?: number;
  last_activity_date?: string;
  sound_enabled?: boolean;
  reminders_enabled?: boolean;
  level?: string;
  rank?: number;
}

// Static class for user-related API methods
export class User {
  /**
   * Fetch the currently authenticated user's data.
   */
  static async me(): Promise<IUser> {
    const res = await api.get("/users/me");
    return res.data;
  }

  /**
   * Update the user's data (coins, points, settings, etc.)
   */
  static async updateMyUserData(updates: Partial<IUser>): Promise<IUser> {
    const res = await api.patch("/users/me", updates);
    return res.data;
  }

  /**
   * Fetch all users (optional, for leaderboard, etc.)
   */
  static async all(): Promise<IUser[]> {
    const res = await api.get("/users");
    return res.data;
  }

  /**
   * Filter or search users (optional helper)
   */
  static async filter(params: Record<string, any>): Promise<IUser[]> {
    const res = await api.get("/users", { params });
    return res.data;
  }
}
