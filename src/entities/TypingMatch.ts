export interface TypingMatchParticipant {
  user_email: string;
  username: string;
  score: number;
  accuracy: number;
  wpm: number;
  rank: number;
}

export interface TypingMatch {
  match_id: string;
  participants: TypingMatchParticipant[];
  text_content: string;
  status: "waiting" | "in_progress" | "completed";
  winner_email?: string;
}

// (Optional) Example mock or API helpers — you can adjust this as needed.
export const TypingMatch = {
  async create(data: TypingMatch) {
    console.log("Creating Typing Match:", data);
    // replace with API call if you have a backend endpoint
    return Promise.resolve(data);
  },

  async getById(match_id: string): Promise<TypingMatch | null> {
    console.log("Fetching Typing Match by ID:", match_id);
    // mock fetch
    return Promise.resolve(null);
  },

  async update(match_id: string, data: Partial<TypingMatch>) {
    console.log("Updating Typing Match:", match_id, data);
    return Promise.resolve({ ...data, match_id });
  }
};
