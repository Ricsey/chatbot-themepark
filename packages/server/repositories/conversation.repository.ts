const conversations = new Map<string, string>();

export const conversationRepository = {
  getLastResponseId(conversationId: string) {
    return conversations.get(conversationId);
  },

  setLastResponseId(converstaionId: string, responseId: string) {
    return conversations.set(converstaionId, responseId);
  },
};
