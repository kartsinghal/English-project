export * from "./User";
export * from "./Mission";
export * from "./UserMission";
export * from "./SpinHistory";
export * from "./TypingMatch";
export * from "./LessonProgress";

export interface IAchievement {
  id: string;
  user_email: string;
  title: string;
  description: string;
  badge_icon?: string;
}

export const Achievement = {
  async filter(filterBy?: { user_email?: string }): Promise<IAchievement[]> {
    const all: IAchievement[] = [
      {
        id: "1",
        user_email: "guest@example.com",
        title: "First Steps",
        description: "Completed your first lesson",
        badge_icon: "🎯",
      },
      {
        id: "2",
        user_email: "guest@example.com",
        title: "Consistency Champ",
        description: "Maintained a 7-day streak",
        badge_icon: "🔥",
      },
    ];

    if (filterBy?.user_email) {
      return all.filter((a) => a.user_email === filterBy.user_email);
    }
    return all;
  },
};


