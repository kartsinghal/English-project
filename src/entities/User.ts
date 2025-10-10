// src/entities/User.ts

export interface IPowerups {
  hints: number;
  time_freeze: number;
  score_multiplier: number;
}

export interface IUser {
  id?: string;
  username: string;
  email: string;
  placement_test_completed: boolean;
  phone: string;
  age: number | null;
  level?: string; // e.g., Beginner, Intermediate, Advanced
  total_points?: number; // for leaderboard
  current_streak?: number; // daily streak
  coins?: number; // in-app currency
  target_preparation?: string; // e.g., IELTS, Job Interview, etc.
  powerups?: IPowerups; // ✅ Power-up data for profile display

  // ✅ Settings page preferences
  sound_enabled?: boolean;
  reminders_enabled?: boolean;
}

export const User = {
  /**
   * Mock current user (simulates a logged-in user)
   */
  async me(): Promise<IUser> {
    return {
      id: "1",
      username: "Guest",
      email: "guest@example.com",
      placement_test_completed: false,
      phone: "",
      age: null,
      level: "Beginner",
      total_points: 120,
      current_streak: 3,
      coins: 250,
      target_preparation: "IELTS",
      powerups: {
        hints: 3,
        time_freeze: 1,
        score_multiplier: 2,
      },
      // ✅ default preferences for Settings
      sound_enabled: true,
      reminders_enabled: true,
    };
  },

  /**
   * Mock list of users (for leaderboard)
   */
  async list(): Promise<IUser[]> {
    return [
      {
        id: "1",
        username: "Guest",
        email: "guest@example.com",
        placement_test_completed: false,
        phone: "",
        age: null,
        level: "Beginner",
        total_points: 120,
        current_streak: 3,
        coins: 250,
        target_preparation: "IELTS",
        powerups: { hints: 3, time_freeze: 1, score_multiplier: 2 },
        sound_enabled: true,
        reminders_enabled: true,
      },
      {
        id: "2",
        username: "Jane",
        email: "jane@example.com",
        placement_test_completed: true,
        phone: "123456789",
        age: 25,
        level: "Intermediate",
        total_points: 300,
        current_streak: 5,
        coins: 500,
        target_preparation: "TOEFL",
        powerups: { hints: 5, time_freeze: 2, score_multiplier: 3 },
        sound_enabled: true,
        reminders_enabled: false,
      },
      {
        id: "3",
        username: "Alex",
        email: "alex@example.com",
        placement_test_completed: true,
        phone: "987654321",
        age: 30,
        level: "Advanced",
        total_points: 500,
        current_streak: 10,
        coins: 900,
        target_preparation: "Job Interview",
        powerups: { hints: 8, time_freeze: 3, score_multiplier: 4 },
        sound_enabled: false,
        reminders_enabled: true,
      },
    ];
  },

  /**
   * Mock Google login redirect
   */
  async loginWithRedirect(redirectUrl: string): Promise<void> {
    console.log("🔐 Redirecting user to login:", redirectUrl);
    window.location.href = redirectUrl;
  },

  /**
   * Mock user profile update
   */
  async updateMyUserData(
    data: Partial<IUser>
  ): Promise<{ success: boolean }> {
    console.log("✅ User data updated:", data);
    return { success: true };
  },

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    console.log("🚪 User logged out");
    // Add real logout logic later
  },
};
