class ChatbotService {
  async askQuestion(question) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chatbot error:', error);
      throw error;
    }
  }
}

export const chatbotApi = new ChatbotService();
