// src/entities/Achievement.ts

export type AchievementCategory = "streak" | "points" | "completion" | "special";

export interface IAchievement {
  user_email?: string;
  title: string;
  description: string;
  badge_icon?: string;
  earned_date?: string; // ISO string format
  category?: AchievementCategory;
  id?: string; // optional unique id
}

export const Achievement = {
  /**
   * Filter achievements for a user
   * @param query object like { user_email: string }
   */
  async filter(query: { user_email?: string }): Promise<IAchievement[]> {
    // Example static data — replace with API call later
    const mockData: IAchievement[] = [
      {
        id: "1",
        title: "First Lesson Complete",
        description: "Completed your first lesson!",
        badge_icon: "🎯",
        earned_date: new Date().toISOString(),
        category: "completion",
        user_email: query.user_email,
      },
      {
        id: "2",
        title: "1000 Points Earned",
        description: "Reached 1000 total points!",
        badge_icon: "🏅",
        earned_date: new Date().toISOString(),
        category: "points",
        user_email: query.user_email,
      },
    ];

    // In real app: filter server-side
    return mockData.filter((a) =>
      query.user_email ? a.user_email === query.user_email : true
    );
  },
};
