export type LessonType =
  | "reading"
  | "typing"
  | "speaking"
  | "grammar"
  | "vocabulary";

export interface LessonProgress {
  user_email: string;
  lesson_type: LessonType;
  lesson_id: string;
  score: number;
  accuracy: number; // percentage accuracy
  time_taken: number; // time in seconds
  mistakes: number;
  completed: boolean;
  bonus_multiplier?: number; // default = 1
}

// Optional helper object (you can connect to your backend later)
export const LessonProgress = {
  async create(data: LessonProgress) {
    console.log("Creating lesson progress:", data);
    // Replace this with your API call to save progress
    return Promise.resolve(data);
  },

  async getByUser(user_email: string): Promise<LessonProgress[]> {
    console.log("Fetching lesson progress for:", user_email);
    // Replace this with your backend fetch
    return Promise.resolve([]);
  },

  async update(lesson_id: string, data: Partial<LessonProgress>) {
    console.log("Updating lesson progress:", lesson_id, data);
    return Promise.resolve({ lesson_id, ...data });
  }
};
