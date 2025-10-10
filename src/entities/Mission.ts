export interface IMission {
  id?: string;
  title: string;
  description: string;
  mission_type: "daily" | "weekly" | "special";
  target_value: number;
  reward_coins: number;
  reward_points: number;
  date: string;
  difficulty: "easy" | "medium" | "hard";
}

export const Mission = {
  async filter(
    filterBy?: { date?: string },
    orderBy?: string,
    limit?: number
  ): Promise<IMission[]> {
    // Mock data for testing
    const allMissions: IMission[] = [
      {
        id: "1",
        title: "Complete Lesson 1",
        description: "Finish your first English lesson",
        mission_type: "daily",
        target_value: 1,
        reward_coins: 50,
        reward_points: 10,
        date: new Date().toISOString().split("T")[0],
        difficulty: "easy",
      },
      {
        id: "2",
        title: "Read an article",
        description: "Improve reading comprehension",
        mission_type: "daily",
        target_value: 1,
        reward_coins: 30,
        reward_points: 5,
        date: new Date().toISOString().split("T")[0],
        difficulty: "easy",
      },
    ];

    // Filter by date
    let results = allMissions;
    if (filterBy?.date) {
      results = results.filter((m) => m.date === filterBy.date);
    }

    // Simple order (for testing)
    if (orderBy === "-created_date") {
      results = [...results].reverse();
    }

    // Limit
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  },
};
