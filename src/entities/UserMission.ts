// src/entities/UserMission.ts

export interface IUserMission {
  user_email: string;
  mission_id: string;
  progress: number;
  completed: boolean;
  completed_date?: string; // optional since it's not always filled
}

export const UserMission = {
  /**
   * Get all user missions (mock data for testing)
   */
  async getAll(): Promise<IUserMission[]> {
    return [
      {
        user_email: "guest@example.com",
        mission_id: "1",
        progress: 50,
        completed: false,
      },
      {
        user_email: "guest@example.com",
        mission_id: "2",
        progress: 100,
        completed: true,
        completed_date: new Date().toISOString(),
      },
    ];
  },

  /**
   * Filter missions by user email or other fields
   */
  async filter(filterBy?: { user_email?: string }): Promise<IUserMission[]> {
    const all = await this.getAll();
    if (filterBy?.user_email) {
      return all.filter((m) => m.user_email === filterBy.user_email);
    }
    return all;
  },

  /**
   * Mark a mission as completed for a specific user
   */
  async markCompleted(
    missionId: string,
    userEmail: string
  ): Promise<IUserMission> {
    // In a real app, you'd send an API request here
    return {
      user_email: userEmail,
      mission_id: missionId,
      progress: 100,
      completed: true,
      completed_date: new Date().toISOString(),
    };
  },
};
