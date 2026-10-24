export const profileService = {
  async getProfile(userId: string) {
    return { id: userId, skills: [], experience: 0 };
  },
  async updateProfile(userId: string, data: any) {
    return { id: userId, ...data };
  }
};
