// SpinHistory.ts

export interface ISpinHistory {
  user_email: string;
  reward_type:
    | "coins"
    | "hints"
    | "time_freeze"
    | "2x_reward_3min"
    | "2x_reward_5min"
    | "score_multiplier";
  reward_amount: number;
  spin_date: string; // ISO date-time string
  was_free: boolean; // true if the spin was free (from streak)
}

export const SpinHistory = {
  /**
   * Mock method to get all spin history records
   */
  async getAll(): Promise<ISpinHistory[]> {
    return [
      {
        user_email: "guest@example.com",
        reward_type: "coins",
        reward_amount: 50,
        spin_date: new Date().toISOString(),
        was_free: false,
      },
      {
        user_email: "guest@example.com",
        reward_type: "hints",
        reward_amount: 2,
        spin_date: new Date().toISOString(),
        was_free: true,
      },
    ];
  },

  /**
   * Mock method to create a new spin history record
   */
  async create(data: ISpinHistory): Promise<ISpinHistory> {
    console.log("✅ Spin history created:", data);
    // In a real app, you'd send this data to a backend API
    return Promise.resolve(data);
  },
};
